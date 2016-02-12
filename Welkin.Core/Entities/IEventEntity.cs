﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Welkin.Core.Entities
{
    public interface IEventEntity
    {
        /// <summary>
        /// Upserts the document.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="collection"></param>
        /// <returns></returns>
        Task UpsertDocument(string document,string collection);

        /// <summary>
        /// Replaces the document.
        /// </summary>
        /// <param name="document">The document.</param>
        /// <param name="collection">The collection.</param>
        /// <returns></returns>
        Task ReplaceDocument(string document, string collection);

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

        Task<object> GetData(string cName, string query,string spName);

        List<object> ExecuteQuery(string cName, string query);
    }
}