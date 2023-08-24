function formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + "-";
    var MM =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
    var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":";
    var mm =
        (date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes()) + ":";
    var ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return YY + MM + DD + " " + hh + mm + ss;
}
function compare(origin, target) {
//   return  console.log(origin,target)
    if(target === null && origin===null){
        return true
    }else if(typeof target === 'object' &&origin===null){
        return false 
    }else if(typeof origin === 'object' &&target===null){
        return false 
    }
    if (typeof target !== "object") {
        //target不是对象/数组
        return origin === target; //直接返回全等的比较结果
    }

    if (typeof origin !== "object") {
        //origin不是对象/数组
        return false; //直接返回false
    }
    for (let key of Object.keys(target)) {
        //遍历target的所有自身属性的key
        if (!compare(origin[key], target[key])) {
            //递归比较key对应的value，
            //value不等，则两对象不等，结束循环，退出函数，返回false
            return false;
        }
    }
    //遍历结束，所有value都深度比较相等，则两对象相等
    return true;
}

const toolFun = {
    compare,
    // json数据转换为导出数据（a=1&b=2...）
    setQueryConfig(queryConfig) {
        var _str = "";
        for (var o in queryConfig) {
            _str += o + "=" + queryConfig[o] + "&";
        }
        _str = _str.substring(0, _str.length - 1); //末尾是&
        return _str
    },
    //获取容器当前高度，重设表格的最大高度
    getTableMaxHeight(_this, callback) {
        _this.$nextTick(function () {
            let wapperBox = document.querySelector(".wapper").attributes;
            // wapper高度
            let height_1 = wapperBox[0].ownerElement.clientHeight;
            let wapperSearch = document.querySelector(".search-box").attributes;
            // seach-box高度
            let height_2 = wapperSearch[0].ownerElement.clientHeight;
            callback && callback(height_1 - height_2 - 40 - 20 - 42 - 42);
            // 需要減去wapper的padding 40
            // 需要減去search的margin 20
            // 需要減去table按鈕的高度 32
            // 需要減去table按鈕的margin 10
            // 需要減去table分頁的高度 42
        });
    },
    // 弹窗确认
    confirmRow(_this, callback, title) {

        title = title ? title : '此操作将永久删除该数据, 是否继续?'
        _this.$confirm(title, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            callback && callback()
        }).catch(() => {
            // _this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // });
        });
    },
    // 时间转换
    /**
    * 时间转换
    */
    dealSoltTime(time) {
        let timeMap = {
            startTime: time ? formatDate(time[0]) : "",
            endTime: time ? formatDate(time[1]) : ""
        }
        return timeMap
    },
    strSort(str) {
        let myStrList = str.split("");
        myStrList.forEach((item, index) => {
            if (Number(item)) {
                if (myStrList[index + 1] === ".") {
                    if (index > 0) {

                        myStrList[index] = `\n${item}`
                    }
                }
            }
        });
        return myStrList.join('')
    },
    urlQueryToObject(str) {
        return JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    },
    minSecond(n) {
        let second_ = Math.floor(n % 60);
        let a = '';
        if (second_ < 10) {
            second_ = '0' + second_;
        }
        if (Math.floor(n / 60) < 10) {
            a = "0" + Math.floor(n / 60);
        } else {
            a = Math.floor(n / 60);
        }

        return {
            m: +a,
            s: +second_
        };
    }

};
export default toolFun;
