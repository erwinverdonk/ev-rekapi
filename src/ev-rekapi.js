(function () {
    "use strict";

    angular
        .module("ev.rekapi", [])
        .directive("evRekapi", ["Rekapi", evRekapi]);

    function evRekapi(Rekapi) {
        return {
            restrict: "E",
            scope: false, // Use parent scope

            link: function (scope, element, attrs) {
                var i, j, k, l;
                var rekapi, context;
                var stateConfigNodes, stateConfigNode, stateAttributes;
                var actor, actorConfigNodes, actorConfigNode, actorSelector, actorElements;
                var keyframeConfigNodes, keyframeConfigNode, keyframeConfigAttributes, keyframeOptions;

                if(attrs.context instanceof CanvasRenderingContext2D){
                    context = attrs.context;
                } else {
                    context = document.body;
                }

                rekapi = new Rekapi(context);
                actorConfigNodes = element.find("actor");

                scope.rekapi = scope.rekapi || [];

                if(attrs.name){
                    if(attrs.name){
                        scope.rekapi[attrs.name] = rekapi;
                    } else {
                        scope.rekapi.push(rekapi);
                    }
                }

                for(i=0;i<actorConfigNodes.length;i++){
                    actorConfigNode = actorConfigNodes[i];
                    actorSelector = actorConfigNode.attributes.selector.value;
                    actorElements = element.parent().find(actorSelector);

                    for(j=0;j<actorElements.length;j++){
                        keyframeConfigNodes = actorConfigNode.querySelectorAll("keyframe");
                        actor = rekapi.addActor({ context: actorElements[j] });

                        for(k=0;k<keyframeConfigNodes.length;k++){
                            keyframeConfigNode = keyframeConfigNodes[k];
                            keyframeConfigAttributes = keyframeConfigNode.attributes;
                            stateConfigNodes = keyframeConfigNode.querySelectorAll("state");

                            keyframeOptions = {};

                            for(l=0;l<stateConfigNodes.length;l++){
                                stateConfigNode = stateConfigNodes[l];
                                stateAttributes = stateConfigNode.attributes;

                                keyframeOptions[stateAttributes.name.value] = stateAttributes.value.value;

                                actor.keyframe(
                                    keyframeConfigAttributes.frame.value,
                                    keyframeOptions,
                                    keyframeConfigAttributes.easing ? keyframeConfigAttributes.easing.value : undefined
                                );
                            }
                        }
                    }
                }
            }
        };
    }
})();