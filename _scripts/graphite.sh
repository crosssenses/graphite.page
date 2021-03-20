# get input from commandline
while getopts i:o:m: flag
do
    case "${flag}" in
        i) input=${OPTARG};;
        o) output=${OPTARG};;
        m) mode=${OPTARG};;
    esac
done

# establish branch and tag name variables
devBranch=development
liveBranch=live
previewBranch=preview

echo "                                                  "
echo "**************************************************"
echo "                                                  "
echo "  📁 in: $input          ";
echo "                                                  "
echo "     out: $output        ";
echo "                                                  "
echo "  🪄 mode: $mode         ";
echo "                                                  "
echo "**************************************************"
echo "                                                  "

read -p "Proceed with these variables? (Y/y)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then

  # Starting publishing
  echo "                        "
  echo "------------------------"
  echo "  Starting to publish   "
  echo "------------------------"
  echo "                        "

  # Make sure to be on development
  git checkout $devBranch


  echo "                        "
  echo "Copying graphite paper "
  echo "------------------------"
  
  # Copy papers
  cp -a $input/_build/. $output

  echo "\033[32m Successfully copied \033[0m"

  # commit build from above
  git add -A
  git commit -m "copied all"
  git pull
  git push

  echo "Commit to development"

  echo "                               "
  echo "Change to preview/live mode    "
  echo "-------------------------------"

  # merge dev branch into preview/live
  
  if [[ $mode -eq "preview" ]]
  then
    git checkout $previewBranch
    git pull
    git merge --no-ff --no-edit $devBranch
    
    echo "\033[32m Build merged into preview\033[0m"
    
    git push
  elif [[ $mode -eq "live" ]]
  then
    git checkout $liveBranch
    git pull
    git merge --no-ff --no-edit $devBranch
    
    echo "\033[32m Build merged into live\033[0m"
    
    git push
  else
    echo "Couldn't change to branch of selected mode."
  fi

  echo "                        "
  echo "Back to development     "
  echo "------------------------"

  # go back into develop
  git checkout $devBranch

  echo "\033[32m                       "
  echo "                           DONE"
  echo "\033[0m"

fi