module.exports = {
    insertFakeData: function(model,data){
        model.findAll({where: data}).then(function(results){
            if(results.length == 0){
                model.create(data).then(function(){
                     console.log('Fake Model Created!');
                     return;
                });
               
            }
        })
    }
}