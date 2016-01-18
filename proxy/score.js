var config = require('../config');
var models = require('../models');
var Score = models.Score;
var ScoreLog = models.ScoreLog;

var scoreRules = config.score;

/**
 * 处理用户积分
 * @param query 查询条件
 * @param callback
 */
exports.handleUserScore = function (userId, key, callback) {

  var rule = scoreRules[key];
  //积分规则不存在
  if (!rule) {
    return callback(getError('积分规则不存在'));
  }

  //积分规则不存在
  if (!userId) {
    return callback(getError('用户ID不存在'));
  }

  Score.findOne({'userId': userId}, function (err, score) {
    if (err) {
      console.error('查询用户积分信息失败', err.stack);
      return callback(getError('查询用户积分信息失败'));
    }

    //true:添加，false:修改
    var flag = false;

    //用户积分为空，初始化操作
    if (score == null) {
      flag = true;
      score = {
        score: 0,
        today: Date.now()
      }
    }

    //当前用户某个操作的积分
    var currScore = score[key];

    if (currScore == null) {
      score[key] = currScore = {
        name: rule.title,
        gainTimes: 0,
      }
    }

    score.score += rule.score;
    currScore.gainTimes++;

    if (getDayStr(new Date(score.today)) !== getDayStr(new Date())) {
      score.today = Date.now();
      if (rule.gainType === 1) {
        currScore.gainTimes = 1;
      }
    }

    if (rule.gainType == 1 && currScore.gainTimes > rule.gainTimes) {//每天获取的次数
      log(userId, key, rule, '今天的积分已经获取完了');
      return callback(getError('今天的积分已经获取完了'));
    }

    if (flag) {
      score.userId = userId;
      Score.create(score, function (err, model) {
          if (err) {
            console.error('更新用户积分失败', err.stack);
            //日志记录
            log(userId, key, rule, err.message);
            return callback(getError('获取积分失败'));
          }
          callback(err, model);

          //日志记录
          log(userId, key, rule);
        }
      );
    } else {
      Score.update({_id: score['_id']}, score, {multi: false}, function (err, model) {
        if (err) {
          console.error('更新用户积分失败', err.stack);
          //日志记录
          log(userId, key, rule, err.message);
          return callback(getError('获取积分失败'));
        }
        callback(err, model);

        //日志记录
        log(userId, key, rule);
      });
    }
  });
};

/**
 * 获取用户的积分
 * @param userId
 */
exports.getUserScore = function (userId) {
  Score.findOne({'userId': userId}, function (err, score) {
    if (err) {
      return callback(err);
    }
    if (score == null) {
      callback(null, 0);
    } else {
      callback(null, score.score);
    }
  });
};

/**
 * 积分日志记录
 */
function log(userId, key, rule, msg) {
  var log = new ScoreLog();
  log.userId = userId;
  log.title = rule.title;
  log.key = key;
  log.score = rule.score;
  log.gainType = rule.gainType;
  log.gainTimes = rule.gainTimes;
  if (msg) {
    log.errorno = 0;
    log.msg = msg;
  }
  log.save(function (err) {
    console.log('积分日志流水记录', err);
  });
}

function getError(msg) {
  return new Error(msg);
}

function getDayStr(date) {
  return date.getFullYear() + date.getMonth() + date.getDate();
}