﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.ServiceModel.Syndication;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Xml;

namespace RubberduckWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Refactorings()
        {
            return View();
        }

        public ActionResult UnitTesting()
        {
            return View();
        }

        public ActionResult Navigation()
        {
            return View();
        }

        public ActionResult SourceControl()
        {
            return View();
        }

        public ActionResult Indentation()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult News()
        {
            return View();
        }

        public async Task<PartialViewResult> BlogFeed()
        {
            try
            {
                return PartialView(await GetBlogFeedItemsAsync());
            }
            catch
            { 
                // Whatever happens, don't return a 500 response code to the jQuery call.
                // That results in a half blank page.

                // If the model is null, an error message is shown, leverage that.
                return PartialView();
            }
        }

        private async Task<IEnumerable<SyndicationItem>> GetBlogFeedItemsAsync()
        {
            const string rssUri = "https://rubberduckvba.wordpress.com/feed/";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(new Uri(rssUri));

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                using (var reader = XmlReader.Create(await response.Content.ReadAsStreamAsync()))
                {
                    var feed = SyndicationFeed.Load(reader);
                    return feed?.Items;
                }
            }
        }
    }
}
