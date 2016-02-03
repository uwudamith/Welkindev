using System;
using Kendo.Mvc.UI;

namespace Welkin.UI.Models
{
    public class SchedulerModel : ISchedulerEvent
    {
        public int OwnerID { get; set; }
        public int TaskID { get; set; }
        public int RecurrenceID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsAllDay { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string StartTimezone { get; set; }
        public string EndTimezone { get; set; }
        public string RecurrenceRule { get; set; }
        public string RecurrenceException { get; set; }
    }
}