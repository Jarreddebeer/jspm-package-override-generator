var express = require('express');
var git = require('nodegit');
var path = require('path');
var fs = require('fs');

var app = express();
app.use(express.static(__dirname + '/www'));

var filename = 'hello.txt';

git.Repo.open(path.resolve(__dirname, '.git'), function(err, repo) {
    if (err) throw err;

    fs.writeFile(path.join(repo.workdir(), filename), 'hello world.', function(writeError) {
        if (writeError) throw writeError;

        repo.openIndex(function(openIndexError, index) {
            if (openIndexError) throw openIndexError;

            index.read(function(readError) {
                if (readError) throw readError;

                index.addByPath(filename, function(addByPathError) {
                    if (addByPathError) throw addByPathError;

                    index.write(function(writeError) {
                        if (writeError) throw writeError;

                        index.writeTree(function(writeTreeError, oid) {
                            if (writeTreeError) throw writeTreeError;

                            // get HEAD
                            git.Reference.oidForName(repo, 'HEAD', function(oidForNameError, head) {
                                if (oidForNameError) throw oidForNameError;

                                // get latest commit
                                repo.getCommit(head, function(getCommitError, parent) {
                                    if (getCommitError) throw getCommitError;

                                    var author = git.Signature.create('Jarred de Beer', 'original@email.com', 123, 60);
                                    var committer = git.Signature.create('Jarred de Beer', 'original@email.com', 456, 90);

                                    // commit
                                    repo.createCommit('HEAD', author, committer, 'test commit', oid, [parent], function(error, commitId) {
                                        console.log('new commit: ' + commitId.sha());
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

});

// app.listen('5050');
