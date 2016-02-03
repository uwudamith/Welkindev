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
        private readonly IDataRepository _dataRepo;

        public Deed(IDataRepository dataRepo)
        {
            _dataRepo = dataRepo;
        }

        public Task<IOrderedQueryable<T>> GetAll<T>(T t, string collectionName = null)
        {
            throw new NotImplementedException();
        }

        public Task<object> GetData(string cName, string query)
        {
            throw new NotImplementedException();
        }

        public void QueryAllDocuments()
        {
            throw new NotImplementedException();
        }

        public async Task UpsertDocument(string document, string type)
        {
            try
            {
                await _dataRepo.UpsertDocument(document, type);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Invalid operation : " + ex.InnerException);
            }
        }
    }
}