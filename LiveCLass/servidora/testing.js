const redis = require('redis')

const client = redis.createClient()

client.on('error',function(error){
    console.log(error)
})

let name2 = "vicki"

client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
// client.hmset(`${name2}`, `id`, `${name2}`);


// client.hgetall(`${name2}`, function(err, object) {
//     console.log(object.id);
// });