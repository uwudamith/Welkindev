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
        },
        initControlls:function () {
            
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
             $('#tree').treeview({data: $m.draft.Structure,
           onNodeSelected: function(event, data) {
          
            $m.nodeSelected(event,data);
          }});
        },
        nodeSelected:function (event,data) {
            if(data && data.selectable != "false"){
                $m.currentNode = data.text;
                $('#uploadModel').modal('toggle');   
            }
        },
          onFileUpload:function(e) {
            
         e.data = { 
            client : $scope.Configs.ClientId , 
            folder:"Draft/"+$m.currentNode
            };  
           
       },
       onUploadSuccess:function (e) {
           
           if(e.files){
                for (var i = 0, x = e.files.length; i < x; i++){
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
                      
                      for(var j = 0, y = $m.draft.Structure[i].nodes.length; j < y; j++){
                          
                          if($m.draft.Structure[i].nodes[j].text === $m.currentNode){
                              var node = {};
                              node.text = e.files[i].name;
                              node.BlobDir = "Draft/"+$m.currentNode;
                              node.selectable = true;
                              node.nodeType = "file";
                                if(!$m.draft.Structure[i].nodes[j].nodes)
                                    $m.draft.Structure[i].nodes[j].nodes = [];
                                     
                               var eNode = $.grep($m.draft.Structure[i].nodes[j].nodes,function (d) {return d.text === e.files[i].name;});
                                if(eNode.length < 1)
                                     $m.draft.Structure[i].nodes[j].nodes.push(node);
                          }
                      }
                  }  
                }
                
                $m.saveDraft('/Draft/SaveDraft', 'POST', $m.draft); 
                $m.createTree();
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
        
    };
  return $m;
}(window.Welkin, window.Welkin.$,window.Welkin.DraftHandler || {}));



