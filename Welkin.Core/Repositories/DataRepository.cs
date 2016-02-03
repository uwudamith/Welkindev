using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Welkin.Core.Entities;

namespace Welkin.Core.Repositories
{
    public class DataRepository : IDataRepository
    {
        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="DataRepository"/> class.
        /// </summary>
        /// <param name="settings">The settings.</param>
        public DataRepository(ISettingsRepository settings)
        {
            _documentDbEndPoint = settings.DocumentDbEndpoint;
            _documentDbAuthKey = settings.DocumentDbAuthKey;
            GetClient(_documentDbEndPoint, _documentDbAuthKey);
        }

        #endregion

        #region Private Variables

        private readonly string _documentDbAuthKey;
        private readonly string _documentDbEndPoint;
        private static DocumentClient _client;

        #endregion

        #region Public Methods

        /// <summary>
        /// Deletes the docs asynchronous.
        /// </summary>
        /// <param name="collName">Name of the coll.</param>
        /// <returns></returns>
        public async Task DeleteDocsAsync(string collName)
        {
            using (_client)
            {
                try
                {
                    var coll =
                        GetClient(_documentDbEndPoint, _documentDbAuthKey)
                            .CreateDocumentCollectionQuery(GetDatabase().CollectionsLink)
                            .Where(d => d.Id == collName)
                            .ToList()
                            .First();
                    var docs = GetClient(_documentDbEndPoint, _documentDbAuthKey)
                        .CreateDocumentQuery(coll.DocumentsLink);

                    foreach (var doc in docs)
                    {
                        await GetClient(_documentDbEndPoint, _documentDbAuthKey).DeleteDocumentAsync(doc.SelfLink);
                    }
                }
                catch (Exception ex)
                {
                    Trace.WriteLine(ex);
                    throw;
                }
            }
        }

        /// <summary>
        /// Upserts the document.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        public async Task UpsertDocument(string document, string type)
        {
            try
            {
                var collName = "Case";

                var ms = new MemoryStream(Encoding.UTF8.GetBytes(document));

                var doc = JsonSerializable.LoadFrom<Document>(ms);

                var res =
                    await
                        _client
                            .CreateDocumentAsync("dbs/" + GetDatabase().Id + "/colls/" + collName, doc);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Invalid Document. : " + ex.InnerException);
                throw ex;
            }
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Gets the client.
        /// </summary>
        /// <param name="uri">The URI.</param>
        /// <param name="_authKey">The _auth key.</param>
        /// <returns></returns>
        private DocumentClient GetClient(string uri, string _authKey)
        {
            try
            {
                if (_client == null)
                {
                    return _client = new DocumentClient(new Uri(uri), _authKey);
                }
                return _client;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets the database.
        /// </summary>
        /// <returns></returns>
        /// <exception cref="System.Exception">Cannot connect to the Database. See inner exception.  + ex.InnerException</exception>
        private Database GetDatabase()
        {
            try
            {
                return
                    GetClient(_documentDbEndPoint, _documentDbAuthKey)
                        .CreateDatabaseQuery()
                        .Where(db => db.Id == "welkindb")
                        .AsEnumerable()
                        .FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception("Cannot connect to the Database. See inner exception. " + ex.InnerException);
            }
        }

        //Check if the collection is there if not then create
        /// <summary>
        /// Creates the document colelction.
        /// </summary>
        /// <param name="type">The type.</param>
        private void CreateDocumentColelction(string type)
        {
            try
            {
                var documentCollection = GetClient(_documentDbEndPoint, _documentDbAuthKey).
                    CreateDocumentCollectionQuery("dbs/" + GetDatabase().Id).Where(c => c.Id == type).
                    AsEnumerable().FirstOrDefault();

                if (documentCollection == null)
                {
                    GetClient(_documentDbEndPoint, _documentDbAuthKey)
                        .CreateDocumentCollectionAsync("dbs/" + GetDatabase().Id,
                            new DocumentCollection
                            {
                                Id = type
                            });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException);
            }
        }


        /// <summary>
        /// Queries all documents.
        /// </summary>
        public void QueryAllDocuments()
        {
            var collection =
                _client.CreateDocumentCollectionQuery("dbs/" + GetDatabase().Id)
                    .Where(c => c.Id == "Case")
                    .ToArray()
                    .FirstOrDefault();
            var docs = _client.CreateDocumentQuery<Case>(collection.SelfLink).ToList();
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t">The t.</param>
        /// <param name="collectionName">Name of the collection.</param>
        /// <returns></returns>
        public async Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            var collection =
              _client.CreateDocumentCollectionQuery("dbs/" + GetDatabase().Id)
                    .Where(c => c.Id == t.GetType().Name)
                    .ToArray()
                    .FirstOrDefault();
            var docs =  _client.CreateDocumentQuery<T>(collection.SelfLink);
            return docs;
        }

        public async Task<object> GetData(string cName,string query)
        {
            var collection =
            _client.CreateDocumentCollectionQuery("dbs/" + GetDatabase().Id)
                  .Where(c => c.Id == cName)
                  .ToArray()
                  .FirstOrDefault();

            return await QueryScalar(collection.SelfLink, query);
        }
      

        private  static async Task<object> QueryScalar(string collectionLink, string javascriptQuery)
        {
            // JavaScript integrated queries are supported using the server side SDK, so you'll be using
            // them within stored procedures and triggers. Here we show them standalone just to demonstrate
            // how to use the functional-Underscore.js style query API
            string javaScriptFunctionStub = string.Format("function() {{ {0}; }}", javascriptQuery);
            string singleQuerySprocName = "query";

            StoredProcedure currentProcedure = _client.CreateStoredProcedureQuery(collectionLink)
                .Where(s => s.Id == singleQuerySprocName)
                .AsEnumerable()
                .FirstOrDefault();

            if (currentProcedure != null)
            {
                currentProcedure.Body = javaScriptFunctionStub;
                await _client.ReplaceStoredProcedureAsync(currentProcedure);
            }
            else
            {
                currentProcedure = await _client.CreateStoredProcedureAsync(
                    collectionLink,
                    new StoredProcedure
                    {
                        Id = singleQuerySprocName,
                        Body = javaScriptFunctionStub
                    });
            }

            StoredProcedureResponse<object> result = await _client.ExecuteStoredProcedureAsync<object>(currentProcedure.SelfLink);
            return result.Response;
        }


        #endregion
    }
}