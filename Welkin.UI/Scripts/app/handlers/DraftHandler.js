window.Welkin.DraftHandler = (function($scope, $, $m) {
    $m = { 
        masterData: {},
        draft:{},
        currentNode:{},
        init: function(options) {
        //alert("DraftHandler");
            this.settings = $scope.$.extend(true, {

            }, options);
            if (this.settings.sAgent) {
                //register client methods with signalr agent
                this.settings.sAgent.registerEvents([
                    {
                        name: "draftDataResponse",
                        fn: this.draftDataResponse
                    }
                ]);
                this.settings.sAgent.start();
            }
            $m. initControlls();
            
             $('#uploadModel').on('hidden.bs.modal', function () {
                $(".k-upload-files.k-reset").find("li").remove();
            })
            
            $(document).on("click", ".btn-upload", function (e) {
                e.preventDefault();
               // debugger;
                $m.currentNode = $(this).closest(".k-item")[0].childNodes[0].innerText.replace(/ /g,'');
              
                $('#uploadModel').modal('toggle');   
              
            });
        },
        initControlls:function () {
            // initialize controls
           $("#draftFileUpload").kendoUpload({
                        async: {
                           saveUrl: "/Draft/SaveUploadFiles",
                            //removeUrl: "remove",
                            autoUpload: true
                        },
                        upload: $m.onFileUpload,
                        success: $m.onUploadSuccess
                    });
        },
        draftDataResponse: function(a) {
            //debugger;
            $m.draft = JSON.parse(JSON.parse(a).JsonResult)[0];
           
        //    $('#tree').treeview({data: $m.draft.Structure,
        //    onNodeSelected: function(event, data) {
        //   
        //     $m.nodeSelected(event,data);
        //   }});
        
        $m.createTree();
        },
        createTree:function(){
            
            $("#tree").kendoTreeView({
            dataSource: $m.draft.Structure,
            template: "#=item.text# # if (item.type === 'file') { #        <button class='btn btn-primary btn-download'> <i class='glyphicon glyphicon glyphicon-download-alt'></i></button>   # } else if(item.type === 'sub') {# <button class='btn btn-primary btn-upload'> <i class='glyphicon glyphicon glyphicon-cloud-upload'></i></button>  #}# ",
            // select: function(e) {
            //     //debugger;
            //     alert("awa");
            // }
            });
        //      $('#tree').treeview({data: $m.draft.Structure,
        //      showTags: true,
        //    
        //    onNodeSelected: function(event, data) {
        //   
        //     $m.nodeSelected(event,data);
        //   }});
        },
        nodeSelected:function (event,data) {
            if(data && data.nodeType === "sub"){
                $m.currentNode = data.text;
                $('#uploadModel').modal('toggle');   
            }
        },
          onFileUpload:function(e) {
            
         e.data = { 
            client : $scope.Configs.ClientId , 
            folder:"Draft/"+ $m.currentNode
            };  
           
       },
       onUploadSuccess:function (e) {
           
           if(e.files){
                for (var h = 0, z = e.files.length; h < z; h++){
                  // var data = $.grep($m.uploadedFiles,function (d) {return d.Name === e.files[i].name;});
                 //if(data.length <1){
                    // var url = $m.blobEndPoint+$scope.Configs.ClientId+"/"+$("#txtDeedNo").val()+"/"+e.files[i].name;
                    // var file = {};
                    // file.Name = e.files[i].name;
                    // file.Extension = e.files[i].extension;
                    // file.Type = e.files[i].rawFile.type;
                    // file.Url = url;
                    // file.BlobDir = "Deed/"+$("#txtDeedNo").val();
                   // $m.uploadedFiles.push(file);
                  // }
                  
                  for (var i = 0, x = $m.draft.Structure.length; i < x; i++){
                      
                      for(var j = 0, y = $m.draft.Structure[i].items.length; j < y; j++){
                          
                          if($m.draft.Structure[i].items[j].text.replace(/ /g,'') === $m.currentNode.replace(/ /g,'')){
                              var node = {};
                            
                              node.text = e.files[h].name;
                              node.BlobDir = "Draft/"+$m.currentNode;
                              //node.selectable = true;
                              node.type = "file";
                         
                                if(!$m.draft.Structure[i].items[j].items)
                                    $m.draft.Structure[i].items[j].items = [];
                                     
                               var eNode = $.grep($m.draft.Structure[i].items[j].items,function (d) {return d.text === e.files[h].name;});
                               
                                if(eNode.length < 1){
                                //var tree = $("#tree").data("kendoTreeView");
                                //tree.append({ text: node.text,BlobDir:node.BlobDir,type:node.type });
                                //tree.append(tree.findByText(node.text), tree.findByText($m.currentNode));
                                  $m.draft.Structure[i].items[j].items.push(node);
                                }
                                    
                          }
                      }
                  }  
                }
                
                $m.saveDraft('/Draft/SaveDraft', 'POST', $m.draft); 
                $m.refreshTree();
           }
             
               
                   
       },
         saveDraft: function (url, type, model) {
            /// <summary>
            /// Call ajax function to save deed
            /// </summary>
            /// <param name="url" type="type"> url of the controller action</param>
            /// <param name="type" type="type"> GET/POST</param>
            /// <param name="model" type="type"> deed object</param>
            $m.settings.common.ajaxFunction(url, type,null, model,true);
        },
        refreshTree:function () {
            debugger;
            var tree = $("#tree").data("kendoTreeView");
              tree.setDataSource($m.draft.Structure);
               tree.dataSource.read();
              // tree.refresh();
        }
    };
  return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DraftHandler || {}));



