GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo
echo
echo -e "${RED} Will clean all mapping ?${NC}"
echo
echo "------------------------------------------------------"
echo

echo -n "ES HOST: "
read ES_HOST

CURL -X DELETE "$ES_HOST/tagdocrefs"
CURL -X DELETE "$ES_HOST/catedocrefs"
CURL -X DELETE "$ES_HOST/histories"
CURL -X DELETE "$ES_HOST/tags"
CURL -X DELETE "$ES_HOST/categories"
CURL -X DELETE "$ES_HOST/users"
CURL -X DELETE "$ES_HOST/documents"
