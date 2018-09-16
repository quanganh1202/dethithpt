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
curl -X PUT "elasticsearch/documents" -H 'Content-Type: application/json' -d @'./resource/document.mapping.json'
echo

# Init user
curl -X PUT "elasticsearch/users" -H 'Content-Type: application/json' -d @'./resource/user.mapping.json'
echo

# Init category
curl -X PUT "elasticsearch/categories" -H 'Content-Type: application/json' -d @'./resource/category.mapping.json'
echo

# Init tag
curl -X PUT "elasticsearch/tags" -H 'Content-Type: application/json' -d @'./resource/tag.mapping.json'
echo

# Init class
curl -X PUT "elasticsearch/classes" -H 'Content-Type: application/json' -d @'./resource/class.mapping.json'
echo

# Init subject
curl -X PUT "elasticsearch/subjects" -H 'Content-Type: application/json' -d @'./resource/subject.mapping.json'
echo

# Init collection
curl -X PUT "elasticsearch/collections" -H 'Content-Type: application/json' -d @'./resource/collection.mapping.json'
echo

# Init history
curl -X PUT "elasticsearch/histories" -H 'Content-Type: application/json' -d @'./resource/history.mapping.json'
echo

echo 'DONE !';