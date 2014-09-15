var exec = require('child_process').exec;


module.exports = function(grunt){
  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build', 
        platforms: ['osx', 'win', 'linux32', 'linux64'],
        version: '0.10.3',
        toolbar: false,
        frame: false
      },
      src: ['./src/**/*'] // Your node-wekit app
    }
  });
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  grunt.registerTask('default', 'nodewebkit');
}