angular.module('angular.xheditor', []).directive('xheditor', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            config: '='
        },
        link: function (scope, element, attrs, ngModel) {
            var ele = $(element),
                contentTimer = null;
            var editor = ele.xheditor(scope.config || {
                // 默认配置
                height: '350',
                cleanPaste: 2
            });

            /**
             * 更新编辑器源代码至ngModel
             */
            function updateContent() {
                ngModel.$setViewValue(editor.getSource());
                if (!$rootScope.$$phase) {
                    scope.$digest();
                }
            }

            if (ngModel) {
                ngModel.$render = function () {
                    try {
                        editor.setSource(ngModel.$viewValue);
                    } catch (e) {

                    }
                };

                // 由于并没有提供内容更新事件，暂时采用$timeout
                (function loop() {
                    contentTimer = $timeout(loop, 1000);
                    updateContent();
                })();
            }

            // 销毁
            scope.$on('$destroy', function () {
                if (ele !== null) {
                    ele.xheditor(false);
                    ele = null;
                }
                if (contentTimer !== null) {
                    $timeout.cancel(contentTimer);
                    contentTimer = null;
                }
            });
        }
    }

}]);