using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Welkin.Core.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public interface IDataRepository
    {
        /// <summary>
        /// Upserts the document.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        Task UpsertDocument(string document, string type);

        /// <summary>
        /// Deletes the docs asynchronous.
        /// </summary>
        /// <param name="collName">Name of the coll.</param>
        /// <returns></returns>
        Task DeleteDocsAsync(string collName);

        /// <summary>
        /// Queries all documents.
        /// </summary>
        void QueryAllDocuments();

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t">The t.</param>
        /// <param name="collectionName">Name of the collection.</param>
        /// <returns></returns>
        Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null);

        Task<object> GetData(string cName, string query);
    }
}