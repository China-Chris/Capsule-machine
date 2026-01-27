// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const capsuleMachine = document.getElementById('capsuleMachine');
    const machineVideo = document.getElementById('machineVideo');
    const ctaButton = document.getElementById('ctaButton');

    // 动画播放状态
    let isPlaying = false;
    let isInitialized = false; // 标记是否已初始化

    // 播放扭蛋机动画
    function playCapsuleMachineAnimation() {
        // 如果正在播放，不重复触发
        if (isPlaying) {
            console.log('视频正在播放中，跳过');
            return;
        }

        console.log('开始播放视频');
        isPlaying = true;
        
        // 重置到开头并取消静音
        machineVideo.currentTime = 0;
        machineVideo.muted = false; // 取消静音
        
        // 使用 Promise 处理播放，添加错误处理
        const playPromise = machineVideo.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('视频播放成功');
                })
                .catch(error => {
                    console.error('视频播放失败:', error);
                    isPlaying = false;
                    // 恢复点击
                    capsuleMachine.style.pointerEvents = 'auto';
                    ctaButton.style.pointerEvents = 'auto';
                });
        }
        
        // 禁用点击
        capsuleMachine.style.pointerEvents = 'none';
        ctaButton.style.pointerEvents = 'none';
    }

    // 视频播放结束后的处理
    function handleVideoEnd() {
        console.log('视频播放结束');
        isPlaying = false;
        
        // 停留在最后一帧，不重置
        // 视频会自动停留在最后一帧，不需要额外操作
        
        // 恢复点击
        capsuleMachine.style.pointerEvents = 'auto';
        ctaButton.style.pointerEvents = 'auto';
        
        // 可以在这里添加后续逻辑，比如跳转到抽奖页面
        // window.location.href = '/raffle';
    }

    // 绑定事件监听器 - 按钮点击
    ctaButton.addEventListener('click', function(e) {
        console.log('CTA按钮被点击');
        e.preventDefault();
        e.stopPropagation();
        playCapsuleMachineAnimation();
    });

    // 绑定事件监听器 - 视频点击
    machineVideo.addEventListener('click', function(e) {
        console.log('视频元素被点击');
        e.preventDefault();
        e.stopPropagation();
        playCapsuleMachineAnimation();
    });

    // 绑定事件监听器 - 容器点击
    capsuleMachine.addEventListener('click', function(e) {
        // 如果点击的不是视频本身，也触发播放
        if (e.target !== machineVideo) {
            console.log('扭蛋机容器被点击');
            e.preventDefault();
            e.stopPropagation();
            playCapsuleMachineAnimation();
        }
    });

    // 监听视频播放结束
    machineVideo.addEventListener('ended', handleVideoEnd);

    // 监听视频加载错误
    machineVideo.addEventListener('error', function(e) {
        console.error('视频加载失败:', e);
        // 如果视频加载失败，恢复点击
        isPlaying = false;
        capsuleMachine.style.pointerEvents = 'auto';
        ctaButton.style.pointerEvents = 'auto';
    });

    // 预加载视频并显示第一帧（只初始化一次）
    function initVideo() {
        // 如果已经初始化过，或者正在播放，就不重复初始化
        if (isInitialized || isPlaying) {
            return;
        }
        
        if (machineVideo.readyState >= 2) {
            machineVideo.currentTime = 0;
            machineVideo.pause();
            isInitialized = true;
            console.log('视频已初始化，显示第一帧');
        }
    }

    // 只在第一次加载数据时初始化
    machineVideo.addEventListener('loadeddata', function() {
        if (!isInitialized) {
            console.log('视频预加载完成');
            initVideo();
        }
    }, { once: true }); // 使用 once 确保只执行一次

    // 页面加载完成后的初始化
    window.addEventListener('load', function() {
        console.log('页面加载完成');
        console.log('视频元素:', machineVideo);
        console.log('视频readyState:', machineVideo.readyState);
        console.log('视频src:', machineVideo.currentSrc || machineVideo.src);
        
        // 延迟一下确保视频元素已准备好
        setTimeout(function() {
            initVideo();
        }, 100);
        
        // 检查元素是否正确获取
        if (!capsuleMachine) {
            console.error('无法找到capsuleMachine元素');
        }
        if (!machineVideo) {
            console.error('无法找到machineVideo元素');
        }
        if (!ctaButton) {
            console.error('无法找到ctaButton元素');
        }
    });

    // 添加键盘支持（按空格键或回车键触发）
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!isPlaying) {
                playCapsuleMachineAnimation();
            }
        }
    });

    // 移动端触摸支持优化
    let touchStartTime = 0;
    capsuleMachine.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
    });

    capsuleMachine.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - touchStartTime;
        // 如果触摸时间很短（小于300ms），认为是点击
        if (touchDuration < 300 && !isPlaying) {
            e.preventDefault();
            playCapsuleMachineAnimation();
        }
    });

    machineVideo.addEventListener('touchend', function(e) {
        e.preventDefault();
        playCapsuleMachineAnimation();
    });
});

