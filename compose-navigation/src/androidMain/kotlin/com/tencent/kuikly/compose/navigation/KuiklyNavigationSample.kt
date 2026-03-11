/*
 * Tencent is pleased to support the open source community by making KuiklyUI
 * available.
 * Copyright (C) 2025 Tencent. All rights reserved.
 * Licensed under the License of KuiklyUI;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://github.com/Tencent-TDS/KuiklyUI/blob/main/LICENSE
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tencent.kuikly.compose.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController

/**
 * Kuikly Navigation Compose 示例
 * 
 * 演示如何在 Kuikly 项目中使用 Jetpack Navigation Compose
 */
@Composable
fun KuiklyNavigationSample() {
    val navController = rememberNavController()
    
    // 设置全局 NavController
    KuiklyNavigation.setNavController(navController)
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        // 首页
        kuiklyComposable("home") {
            HomeScreen(navController)
        }
        
        // 详情页（带参数）
        kuiklyComposable("detail/{id}") { backStackEntry ->
            val id = backStackEntry.getStringArg("id") ?: "unknown"
            DetailScreen(navController, id)
        }
        
        // 设置页
        kuiklyComposable("settings") {
            SettingsScreen(navController)
        }
    }
}

@Composable
private fun HomeScreen(navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Welcome to Kuikly Navigation", style = MaterialTheme.typography.h4)
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(onClick = {
            navController.navigate("detail/123")
        }) {
            Text("Go to Detail (ID: 123)")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = {
            navController.navigate("settings")
        }) {
            Text("Go to Settings")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // 使用全局导航助手
        Button(onClick = {
            KuiklyNavigation.navigateTo("detail/456")
        }) {
            Text("Navigate using KuiklyNavigation (ID: 456)")
        }
    }
}

@Composable
private fun DetailScreen(navController: NavHostController, id: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Detail Screen", style = MaterialTheme.typography.h4)
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text("Item ID: $id", style = MaterialTheme.typography.h6)
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(onClick = {
            navController.popBackStack()
        }) {
            Text("Back to Home")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // 使用全局导航助手
        Button(onClick = {
            KuiklyNavigation.navigateBack()
        }) {
            Text("Back using KuiklyNavigation")
        }
    }
}

@Composable
private fun SettingsScreen(navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Settings Screen", style = MaterialTheme.typography.h4)
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(onClick = {
            navController.popBackStack()
        }) {
            Text("Back to Home")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(onClick = {
            KuiklyNavigation.navigateAndClearBackStack("home")
        }) {
            Text("Back to Home (Clear Stack)")
        }
    }
}
