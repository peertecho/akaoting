dirname=$(dirname $0)
rootdir=$dirname/..

echo
echo "Building types..."
for lib in b4a hypercore-crypto hyperswarm pear-interface; do
  echo $lib
  rm -rf $rootdir/node_modules/$lib/*.d.ts $rootdir/node_modules/$lib/**/*.d.ts
  npx tsc --allowJs --declaration --emitDeclarationOnly $rootdir/node_modules/$lib/*.js $rootdir/node_modules/$lib/**/*.js > /dev/null 2>&1 &
done
wait
