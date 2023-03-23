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
  echo " Starting to publish    "
  echo "------------------------"
  echo "                        "

  # Make sure to be on development
  git checkout $devBranch

  echo "                        "
  echo " Copying graphite paper "
  echo "------------------------"
  
  # Copy papers
  cp -a $input/_build/. $output

  echo "\033[32mSuccessfully copied $output"

  sed -i -E "s/src=\"\/static\//src=\"static\//" $output/index.html

  echo "Replaced /static/ with static/ \033[0m"

  # Run sitemap script

  echo "                        "
  echo " Rebuild Sitemap        "
  echo "------------------------"

  # Exit if already in shell to prevent error
  pipenv run python3 $PWD/_scripts/parser.py 
  echo "\033[32mSuccessfully updated sitemap \033[0m"
  echo    # (optional) move to a new line

  # commit build from above
  git add -A
  git commit -m "copied all files for $output"
  git pull
  git push

  echo "Commit to development"

  echo "                               "
  echo " Change to preview/live mode   "
  echo "-------------------------------"

  # merge dev branch into preview/live
  
  if [ $mode = "preview" ]
  then
#    echo "I'm in preview."
    git checkout $previewBranch
    git pull
    git merge --no-ff --no-edit $devBranch
    
    echo "\033[32m Build merged into preview for $output\033[0m"
    
    git push
  elif [ $mode = "live" ]
  then
#    echo "I'm in live."
    # git checkout $liveBranch
    # git pull
    # git merge --no-ff --no-edit $devBranch

    echo "                        "
    echo " Copying graphite paper "
    echo "------------------------"
    
    # Copy papers
    cp -a $input/_build/. $output

    echo "\033[32mSuccessfully copied $output"

    sed -i -E "s/src=\"\/static\//src=\"static\//" $output/index.html

    echo "Replaced /static/ with static/ \033[0m"

    # Run sitemap script

    echo "                        "
    echo " Rebuild Sitemap        "
    echo "------------------------"

    # Exit if already in shell to prevent error
    pipenv run python3 $PWD/_scripts/parser.py 
    echo "\033[32mSuccessfully updated sitemap \033[0m"
    echo    # (optional) move to a new line

    # commit build from above
    git add -A
    git commit -m "copied all files for $output"
    git pull
    git push
    
    echo "\033[32m Copying and scripts repeated on live for $output\033[0m"
    
    git push
  else
    echo "Couldn't change to branch of selected mode."
  fi

  echo "                        "
  echo " Back to development    "
  echo "------------------------"

  # go back into develop
  git checkout $devBranch

  echo "\033[32m"
  echo "   DONE "
  echo "\033[0m "
  echo "                        "
  echo " Site published         "
  echo "------------------------"

  if [ $mode = "preview" ]
  then
    echo " URL: https://preview.graphit.page/$output"
  else
    echo " URL: https://graphit.page/$output"
  fi

  echo "                        "

fi
