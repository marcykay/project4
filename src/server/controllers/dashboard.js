module.exports = (db) => {

    let apiget = (request, response) => {
        const stuff = {
            banana: 'oranges',
            kiwi: 'apple'
        };

        response.send(stuff);
    };



    let get = (request, response) => {

        // use dashboard model method `get` to retrieve dashboard data
        console.log(db)

        db.dashboard.get(request.params.id, (error, dashboard) => {
            // queryResult contains dashboard data returned from the dashboard model
            if (error) {

                console.error('error getting dashboard', error);
                response.status(500);
                response.send('server error');

            } else {

                if (dashboard === null) {

                    // render dashboard view in the dashboard folder
                    response.status(404);
                    response.send('not found');

                } else {

                    // render dashboard view in the dashboard folder
                    response.render('dashboard/show', {
                        dashboard: dashboard
                    });

                }
            }
        });
    };

    return {

        get: get,
        apiget: apiget
    }

};
