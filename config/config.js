module.exports =  {
    local : function()
    {
        return {
            "host" : "127.0.0.1",
            "port" : "27017",
            "database" : "play",
            "username" : "admin",
            "password" : "123456"
        };
    },
    staging : function()
    {
        return {
            "host" : "ds151909.mlab.com",
            "port" : "51909",
            "database" : "play-db",
            "username" : "play-dev",
            "password" : "play"
        }
    },
    prod : function()
    {
        return {
            "host" : "ds151909.mlab.com",
            "port" : "51909",
            "database" : "play-devs-prod",
            "username" : "play",
            "password" : "play"
        };
    }

};
