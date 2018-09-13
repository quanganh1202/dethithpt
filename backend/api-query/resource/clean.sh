GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo
echo -e "${RED} Will clean all mapping ?${NC}"
echo
echo "------------------------------------------------------"
echo

ES_HOST='localhost:9200'

curl -X DELETE "$ES_HOST/histories"
curl -X DELETE "$ES_HOST/tags"
curl -X DELETE "$ES_HOST/categories"
curl -X DELETE "$ES_HOST/users"
curl -X DELETE "$ES_HOST/documents"
curl -X DELETE "$ES_HOST/collections"
curl -X DELETE "$ES_HOST/subjects"
curl -X DELETE "$ES_HOST/classes"