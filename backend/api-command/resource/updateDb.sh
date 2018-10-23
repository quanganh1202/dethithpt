echo "-------------------Updating database-------------------"

mysql -u$ACCOUNT -p$PASSWORD -e "
  USE $DATABASE;

  ALTER TABLE tbUser
  ADD COLUMN blockDownloadClasses VARCHAR(255) NULL,
  ADD COLUMN blockDownloadYearSchools VARCHAR(255) NULL;
"
if [ $? == 0 ]
then
  echo "-------------------DONE-------------------"
else
  echo "-------------------ERROR-------------------"
fi