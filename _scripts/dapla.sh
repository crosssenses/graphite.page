# establish branch and tag name variables
devBranch=development
masterBranch=live

# Starting publishing
echo "                        "
echo "------------------------"
echo "  Starting to publish   "
echo "------------------------"
echo "                        "

# Make sure to be on development
git checkout $devBranch


echo "                        "
echo "Copying graphite papers "
echo "------------------------"


# Copy papers
cp -a ../hiig-graphite-publications/dapla-bericht/_build/. hiig-dapla

echo "\033[32mSuccessfully copied \033[0m"

# commit build from above
git commit -a -m "copied all"
git pull
git push

echo "Commit to development"

echo "                        "
echo "Change to production    "
echo "------------------------"

# merge release branch with the new version number into master
git checkout $masterBranch
git pull
git merge --no-ff --no-edit $devBranch

echo "\033[32m Build merged into production \033[0m"

git push

echo "                        "
echo "Back to development     "
echo "------------------------"

# go back into develop
git checkout $devBranch

echo "\033[32m                       "
echo "                           DONE"
echo "\033[0m"

