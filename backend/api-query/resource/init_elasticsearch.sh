GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo
echo -e "${GREEN} Initial Processing ${NC}"
echo
echo "------------------------------------------------------"
echo

# Init document
curl -X PUT "$ES_HOST:9200/documents" -H 'Content-Type: application/json' -d @'./resource/document.mapping.json'
echo

# Init user
curl -X PUT "$ES_HOST:9200/users" -H 'Content-Type: application/json' -d @'./resource/user.mapping.json'
echo

# Init category
curl -X PUT "$ES_HOST:9200/categories" -H 'Content-Type: application/json' -d @'./resource/category.mapping.json'
echo

# Init tag
curl -X PUT "$ES_HOST:9200/tags" -H 'Content-Type: application/json' -d @'./resource/tag.mapping.json'
echo

# Init class
curl -X PUT "$ES_HOST:9200/classes" -H 'Content-Type: application/json' -d @'./resource/class.mapping.json'
echo

# Init subject
curl -X PUT "$ES_HOST:9200/subjects" -H 'Content-Type: application/json' -d @'./resource/subject.mapping.json'
echo

# Init collection
curl -X PUT "$ES_HOST:9200/collections" -H 'Content-Type: application/json' -d @'./resource/collection.mapping.json'
echo

# Init purchase
curl -X PUT "$ES_HOST:9200/purchases" -H 'Content-Type: application/json' -d @'./resource/purchase.mapping.json'
echo

# Init roles
curl -X PUT "$ES_HOST:9200/roles" -H 'Content-Type: application/json' -d @'./resource/role.mapping.json'
echo

echo 'DONE !';