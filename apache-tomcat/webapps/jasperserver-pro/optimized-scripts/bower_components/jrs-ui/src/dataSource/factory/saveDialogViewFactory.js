define(["require","dataSource/saveDialog/BaseSaveDialogView","dataSource/saveDialog/TextDataSourceSaveDialogView","dataSource/saveDialog/DomainSaveDialogView"],function(a){var e=a("dataSource/saveDialog/BaseSaveDialogView"),i=a("dataSource/saveDialog/TextDataSourceSaveDialogView"),o=a("dataSource/saveDialog/DomainSaveDialogView"),t={};return t.textDataSource=i,t.domain=o,{getView:function(a){var i;return i=e,t[a]&&(i=t[a]),i}}});