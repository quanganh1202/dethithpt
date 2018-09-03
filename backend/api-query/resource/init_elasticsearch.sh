GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo
echo -e "${GREEN} Please enter elasticsearch host${NC}"
echo
echo "------------------------------------------------------"
echo

echo -n "ES HOST: "
read ES_HOST

# Init document
curl -X PUT "$ES_HOST/documents" -H 'Content-Type: application/json' -d @'./resource/document.mapping.json'
echo

# Init user
curl -X PUT "$ES_HOST/users" -H 'Content-Type: application/json' -d @'./resource/user.mapping.json'
echo

# Init category
curl -X PUT "$ES_HOST/categories" -H 'Content-Type: application/json' -d @'./resource/category.mapping.json'
echo

# Init tag
curl -X PUT "$ES_HOST/tags" -H 'Content-Type: application/json' -d @'./resource/tag.mapping.json'
echo

# Init class
curl -X PUT "$ES_HOST/classes" -H 'Content-Type: application/json' -d @'./resource/class.mapping.json'
echo

# Init subject
curl -X PUT "$ES_HOST/subjects" -H 'Content-Type: application/json' -d @'./resource/subject.mapping.json'
echo

# Init collection
curl -X PUT "$ES_HOST/collections" -H 'Content-Type: application/json' -d @'./resource/collection.mapping.json'
echo

# Init history
curl -X PUT "$ES_HOST/histories" -H 'Content-Type: application/json' -d @'./resource/history.mapping.json'
echo

# Init cate doc ref
curl -X PUT "$ES_HOST/catedocrefs" -H 'Content-Type: application/json' -d @'./resource/catedocref.mapping.json'
echo

# Init tag doc ref
curl -X PUT "$ES_HOST/tagdocrefs" -H 'Content-Type: application/json' -d @'./resource/tagdocref.mapping.json'
echo

echo 'DONE !';