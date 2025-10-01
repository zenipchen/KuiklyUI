目前已经支持 Android iOS H5 小程序等渲染， 我希望实现桌面的渲染。我计算渲染层使用 web，然后逻辑层 core compose 部分维持 jvm 的形态运行，通过 webview 驱动 web 的渲染，驱动逻辑层计算并渲染到桌面中。这个桌面主体使用 JVM，帮忙连续编程直完全实现该能力。

已知Android 目前基于 core compose 为逻辑层，core-render-android 为渲染层。并由core-render-android 驱动渲染在 Android 的具体 View 中
