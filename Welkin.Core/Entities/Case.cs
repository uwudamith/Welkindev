using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Welkin.Core.Repositories;

namespace Welkin.Core.Entities
{
    [EntityType(new[] {"Case"})]
    public class Case : IEventEntity
    {
        //public string id { get; set; }
        //public int CaseId { get; set; }
        //public string CaseNumber { get; set; }
        //public string Description { get; set; }
        //public DateTime StartDateTime { get; set; }
        //public bool Status { get; set; }
        private IDataRepository _dataRepository;
        public Case(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
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

        public void QueryAllDocuments()
        {
            Program.Container.Resolve<IDataRepository>().QueryAllDocuments();
        }

        public Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            throw new NotImplementedException();
        }

        public Task<object> GetData(string cName, string query,string spName)
        {
            throw new NotImplementedException();
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

        public Task DeleteDocument(string document)
        {
            throw new NotImplementedException();
        }
    }
}