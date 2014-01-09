var git = require('nodegit');

git.Repo.open('.git', function(err, repo) {
    if (err) throw err;

    repo.getMaster(function(err, branch) {
        if (err) throw err;

        var history = branch.history();
        history.on('commit', function(err, commit) {
            if (err) throw err;
            console.log(commit.sha());
            console.log(commit.date());
        });
    });
});
