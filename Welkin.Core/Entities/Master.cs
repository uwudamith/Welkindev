using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Welkin.Core.Repositories;

namespace Welkin.Core.Entities
{
    [EntityType(new[] {"Master"})]
    public class Master : IEventEntity
    {
        private IDataRepository _dataRepository;

        public string Id { get; set; }
        public string Type { get; set; }
        public List<Court> Courts { get; set; }
        public List<CaseType> CaseTypes { get; set; } 

        public Master(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }
        public void QueryAllDocuments()
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

        public async Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            return await _dataRepository.GetAll<T>(t, collectionName);
        }

        public Task<object> GetData(string cName, string query,string spName)
        {
            return _dataRepository.GetData(cName, query,spName);
        }

        public Task ReplaceDocument(string document, string collection)
        {
            throw new NotImplementedException();
        }

        public List<object> ExecuteQuery(string cName, string query)
        {
            throw new NotImplementedException();
        }
    }
}