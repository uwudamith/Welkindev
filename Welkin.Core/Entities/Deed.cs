using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Welkin.Core.Repositories;

namespace Welkin.Core.Entities
{
    [EntityType(new[] {"Deed"})]
    public class Deed : IEventEntity
    {
        private readonly IDataRepository _dataRepository;

        public Deed(IDataRepository dataRepo)
        {
            _dataRepository = dataRepo;
        }

        public Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            throw new NotImplementedException();
        }

        public Task<object> GetData(string cName, string query,string spName)
        {
            throw new NotImplementedException();
        }

        public void QueryAllDocuments()
        {
            throw new NotImplementedException();
        }

        public async Task UpsertDocument(string document, string collection)
        {
            try
            {
                await _dataRepository.UpsertDocument(document,collection);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Invalid operation : " + ex.InnerException);
            }
        }

        public async Task ReplaceDocument(string document, string collection)
        {
            try
            {
                await _dataRepository.ReplaceDocument(document, collection);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Invalid operation : " + ex.InnerException);
            }
        }

        public List<object> ExecuteQuery(string cName, string query)
        {
            return _dataRepository.ExecuteQuery(cName, query);
        }

        public Task DeleteDocument(string docSelectQuery, string cName)
        {
            throw new NotImplementedException();
        }

       
    }
}