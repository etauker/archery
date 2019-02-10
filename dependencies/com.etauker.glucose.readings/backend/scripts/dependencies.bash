echo "--- scripts/dependencies.bash ---"

rm -Rf ./src/data
mkdir ./src/data
cp -a ../../com.etauker.glucose.core/backend/src/data/ ./src/data/
