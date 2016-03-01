using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Welkin.Core.Repositories;

namespace Welkin.Core.Entities
{
    [EntityType(new[] { "Scheduler" })]
    public class Scheduler:IEventEntity
    {
        private IDataRepository _dataRepository;
        public Scheduler(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

      

        public List<object> ExecuteQuery(string cName, string query)
        {
            return _dataRepository.ExecuteQuery(cName, query);
        }

        public async Task DeleteDocument(string docSelectQuery, string cName)
        {
            await _dataRepository.DeleteDocument(docSelectQuery, cName);
        }

        public Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            throw new NotImplementedException();
        }

        public Task<object> GetData(string cName, string query, string spName)
        {
            throw new NotImplementedException();
        }

        public void QueryAllDocuments()
        {
            throw new NotImplementedException();
        }

        public Task ReplaceDocument(string document, string collection)
        {
            throw new NotImplementedException();
        }

        public async Task UpsertDocument(string document, string collection)
        {
            try
            {
                await _dataRepository.UpsertDocument(document, collection);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Invalid operation : " + ex.InnerException);
            }
        }
    }
}
