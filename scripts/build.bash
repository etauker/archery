echo "--- scripts/build.bash ---"
export project_root=`pwd`
echo "Project Root: $project_root"

cd $project_root/dependencies/com.etauker.glucose.charts/frontend
npm install
