# establish branch and tag name variables
devBranch=development
masterBranch=production
releaseBranch=release-$versionLabel

# define paper
paper[0]="policy-brief-audits"
paper[1]="policy-brief-blackbox"
paper[2]="policy-brief-values"

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
cp -a ../ethics-of-digitalisation/policy-brief-audits/_build/. policy-brief-audits
cp -a ../ethics-of-digitalisation/policy-brief-blackbox/_build/. policy-brief-blackbox
cp -a ../ethics-of-digitalisation/policy-brief-values/_build/. policy-brief-values

# Copy root static till static fixed
cp -a ../ethics-of-digitalisation/static/. static

echo "\033[32mSuccessfully copied \033[0m"

# commit build from above
git commit -a -m "copied all"

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

