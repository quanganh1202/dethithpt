GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo -e "${RED} CLEANING ?${NC}"
echo
echo "------------------------------------------------------"
echo

curl -X DELETE "$ES_HOST:9200/tags"
curl -X DELETE "$ES_HOST:9200/categories"
curl -X DELETE "$ES_HOST:9200/users"
curl -X DELETE "$ES_HOST:9200/documents"
curl -X DELETE "$ES_HOST:9200/collections"
curl -X DELETE "$ES_HOST:9200/subjects"
curl -X DELETE "$ES_HOST:9200/classes"
curl -X DELETE "$ES_HOST:9200/purchases"
curl -X DELETE "$ES_HOST:9200/roles"
curl -X DELETE "$ES_HOST:9200/downloads"
curl -X DELETE "$ES_HOST:9200/comments"