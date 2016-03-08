using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Welkin.UI.Models
{
  
    public class AttachmentModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string BlobDir { get; set; }
        public string Extension { get; set; }
        public string Url { get; set; }
    }
}