echo "--- scripts/build.bash ---"
export project_root=`pwd`
echo "Project Root: $project_root"

echo ""
echo "--- compiling backend dependencies ---"

cd $project_root/dependencies/com.etauker.security/backend
npm install

cd $project_root/dependencies/com.etauker.glucose.core/backend
npm install

cd $project_root/dependencies/com.etauker.glucose.readings/backend
npm install

echo ""
echo "--- compiling frontend dependencies ---"
cd $project_root/dependencies/com.etauker.glucose.charts/frontend
npm install
