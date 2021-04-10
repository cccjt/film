const gulp = require('gulp')
const GulpSSH = require('gulp-ssh')

// 需要上传到服务器的路径
const remotePath = '/home/wwwroot/film'
const config = {
  ssh: {

  },
  remotePath,
  commands: [
    // 删除现有文件
    `rm -rf ${remotePath}`
  ]
}
const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config.ssh
})

/**
 * 上传前先删除服务器上现有文件...
 */
gulp.task('execSSH', () => {
  return gulpSSH.shell(config.commands, { filePath: 'commands.log' })
    .pipe(gulp.dest('logs'))
})

/**
 * 上传文件到服务器
 */
gulp.task('upload', () => {
  return gulp.src('./dist/build/h5/**')
    .pipe(gulpSSH.dest(config.remotePath))
})

/**
 * 上传完成
 */
gulp.task('default', gulp.series('execSSH', 'upload', done => {
  done()
  console.log('上传完成')
}))
