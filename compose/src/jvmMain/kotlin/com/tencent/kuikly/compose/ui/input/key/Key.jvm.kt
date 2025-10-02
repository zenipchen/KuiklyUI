/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tencent.kuikly.compose.ui.input.key

import java.awt.event.KeyEvent as AwtKeyEvent
import com.tencent.kuikly.compose.ui.input.key.Key.Companion.Number
import com.tencent.kuikly.compose.ui.util.packInts
import com.tencent.kuikly.compose.ui.util.unpackInt1

// Define missing key codes for Android-specific keys that don't exist in AWT
private const val KEYCODE_UNKNOWN = AwtKeyEvent.VK_UNDEFINED
private const val KEYCODE_SOFT_LEFT = 1
private const val KEYCODE_SOFT_RIGHT = 2
private const val KEYCODE_HOME = 3
private const val KEYCODE_CALL = 5
private const val KEYCODE_ENDCALL = 6
private const val KEYCODE_0 = AwtKeyEvent.VK_0
private const val KEYCODE_1 = AwtKeyEvent.VK_1
private const val KEYCODE_2 = AwtKeyEvent.VK_2
private const val KEYCODE_3 = AwtKeyEvent.VK_3
private const val KEYCODE_4 = AwtKeyEvent.VK_4
private const val KEYCODE_5 = AwtKeyEvent.VK_5
private const val KEYCODE_6 = AwtKeyEvent.VK_6
private const val KEYCODE_7 = AwtKeyEvent.VK_7
private const val KEYCODE_8 = AwtKeyEvent.VK_8
private const val KEYCODE_9 = AwtKeyEvent.VK_9
private const val KEYCODE_STAR = AwtKeyEvent.VK_ASTERISK
private const val KEYCODE_POUND = AwtKeyEvent.VK_NUMBER_SIGN
private const val KEYCODE_DPAD_UP = AwtKeyEvent.VK_UP
private const val KEYCODE_DPAD_DOWN = AwtKeyEvent.VK_DOWN
private const val KEYCODE_DPAD_LEFT = AwtKeyEvent.VK_LEFT
private const val KEYCODE_DPAD_RIGHT = AwtKeyEvent.VK_RIGHT
private const val KEYCODE_DPAD_CENTER = AwtKeyEvent.VK_ENTER
private const val KEYCODE_DPAD_UP_LEFT = 268
private const val KEYCODE_DPAD_DOWN_LEFT = 269
private const val KEYCODE_DPAD_UP_RIGHT = 270
private const val KEYCODE_DPAD_DOWN_RIGHT = 271
private const val KEYCODE_VOLUME_UP = 24
private const val KEYCODE_VOLUME_DOWN = 25
private const val KEYCODE_POWER = 26
private const val KEYCODE_CAMERA = 27
private const val KEYCODE_CLEAR = AwtKeyEvent.VK_CLEAR
private const val KEYCODE_A = AwtKeyEvent.VK_A
private const val KEYCODE_B = AwtKeyEvent.VK_B
private const val KEYCODE_C = AwtKeyEvent.VK_C
private const val KEYCODE_D = AwtKeyEvent.VK_D
private const val KEYCODE_E = AwtKeyEvent.VK_E
private const val KEYCODE_F = AwtKeyEvent.VK_F
private const val KEYCODE_G = AwtKeyEvent.VK_G
private const val KEYCODE_H = AwtKeyEvent.VK_H
private const val KEYCODE_I = AwtKeyEvent.VK_I
private const val KEYCODE_J = AwtKeyEvent.VK_J
private const val KEYCODE_K = AwtKeyEvent.VK_K
private const val KEYCODE_L = AwtKeyEvent.VK_L
private const val KEYCODE_M = AwtKeyEvent.VK_M
private const val KEYCODE_N = AwtKeyEvent.VK_N
private const val KEYCODE_O = AwtKeyEvent.VK_O
private const val KEYCODE_P = AwtKeyEvent.VK_P
private const val KEYCODE_Q = AwtKeyEvent.VK_Q
private const val KEYCODE_R = AwtKeyEvent.VK_R
private const val KEYCODE_S = AwtKeyEvent.VK_S
private const val KEYCODE_T = AwtKeyEvent.VK_T
private const val KEYCODE_U = AwtKeyEvent.VK_U
private const val KEYCODE_V = AwtKeyEvent.VK_V
private const val KEYCODE_W = AwtKeyEvent.VK_W
private const val KEYCODE_X = AwtKeyEvent.VK_X
private const val KEYCODE_Y = AwtKeyEvent.VK_Y
private const val KEYCODE_Z = AwtKeyEvent.VK_Z
private const val KEYCODE_COMMA = AwtKeyEvent.VK_COMMA
private const val KEYCODE_PERIOD = AwtKeyEvent.VK_PERIOD
private const val KEYCODE_ALT_LEFT = AwtKeyEvent.VK_ALT
private const val KEYCODE_ALT_RIGHT = AwtKeyEvent.VK_ALT_GRAPH
private const val KEYCODE_SHIFT_LEFT = AwtKeyEvent.VK_SHIFT
private const val KEYCODE_SHIFT_RIGHT = AwtKeyEvent.VK_SHIFT
private const val KEYCODE_TAB = AwtKeyEvent.VK_TAB
private const val KEYCODE_SPACE = AwtKeyEvent.VK_SPACE
private const val KEYCODE_SYM = 63
private const val KEYCODE_EXPLORER = 64
private const val KEYCODE_ENVELOPE = 65
private const val KEYCODE_ENTER = AwtKeyEvent.VK_ENTER
private const val KEYCODE_DEL = AwtKeyEvent.VK_BACK_SPACE
private const val KEYCODE_GRAVE = AwtKeyEvent.VK_BACK_QUOTE
private const val KEYCODE_MINUS = AwtKeyEvent.VK_MINUS
private const val KEYCODE_EQUALS = AwtKeyEvent.VK_EQUALS
private const val KEYCODE_LEFT_BRACKET = AwtKeyEvent.VK_OPEN_BRACKET
private const val KEYCODE_RIGHT_BRACKET = AwtKeyEvent.VK_CLOSE_BRACKET
private const val KEYCODE_BACKSLASH = AwtKeyEvent.VK_BACK_SLASH
private const val KEYCODE_SEMICOLON = AwtKeyEvent.VK_SEMICOLON
private const val KEYCODE_APOSTROPHE = AwtKeyEvent.VK_QUOTE
private const val KEYCODE_SLASH = AwtKeyEvent.VK_SLASH
private const val KEYCODE_AT = AwtKeyEvent.VK_AT
private const val KEYCODE_NUM = 78
private const val KEYCODE_HEADSETHOOK = 79
private const val KEYCODE_FOCUS = 80
private const val KEYCODE_PLUS = AwtKeyEvent.VK_PLUS
private const val KEYCODE_MENU = AwtKeyEvent.VK_CONTEXT_MENU
private const val KEYCODE_NOTIFICATION = 83
private const val KEYCODE_SEARCH = 84
private const val KEYCODE_MEDIA_PLAY_PAUSE = 85
private const val KEYCODE_MEDIA_STOP = 86
private const val KEYCODE_MEDIA_NEXT = 87
private const val KEYCODE_MEDIA_PREVIOUS = 88
private const val KEYCODE_MEDIA_REWIND = 89
private const val KEYCODE_MEDIA_FAST_FORWARD = 90
private const val KEYCODE_MUTE = 91
private const val KEYCODE_PAGE_UP = AwtKeyEvent.VK_PAGE_UP
private const val KEYCODE_PAGE_DOWN = AwtKeyEvent.VK_PAGE_DOWN
private const val KEYCODE_PICTSYMBOLS = 94
private const val KEYCODE_SWITCH_CHARSET = 95
private const val KEYCODE_BUTTON_A = 96
private const val KEYCODE_BUTTON_B = 97
private const val KEYCODE_BUTTON_C = 98
private const val KEYCODE_BUTTON_X = 99
private const val KEYCODE_BUTTON_Y = 100
private const val KEYCODE_BUTTON_Z = 101
private const val KEYCODE_BUTTON_L1 = 102
private const val KEYCODE_BUTTON_R1 = 103
private const val KEYCODE_BUTTON_L2 = 104
private const val KEYCODE_BUTTON_R2 = 105
private const val KEYCODE_BUTTON_THUMBL = 106
private const val KEYCODE_BUTTON_THUMBR = 107
private const val KEYCODE_BUTTON_START = 108
private const val KEYCODE_BUTTON_SELECT = 109
private const val KEYCODE_BUTTON_MODE = 110
private const val KEYCODE_ESCAPE = AwtKeyEvent.VK_ESCAPE
private const val KEYCODE_FORWARD_DEL = AwtKeyEvent.VK_DELETE
private const val KEYCODE_CTRL_LEFT = AwtKeyEvent.VK_CONTROL
private const val KEYCODE_CTRL_RIGHT = AwtKeyEvent.VK_CONTROL
private const val KEYCODE_CAPS_LOCK = AwtKeyEvent.VK_CAPS_LOCK
private const val KEYCODE_SCROLL_LOCK = AwtKeyEvent.VK_SCROLL_LOCK
private const val KEYCODE_META_LEFT = AwtKeyEvent.VK_META
private const val KEYCODE_META_RIGHT = AwtKeyEvent.VK_META
private const val KEYCODE_FUNCTION = AwtKeyEvent.VK_F24
private const val KEYCODE_SYSRQ = AwtKeyEvent.VK_PRINTSCREEN
private const val KEYCODE_BREAK = AwtKeyEvent.VK_PAUSE
private const val KEYCODE_MOVE_HOME = AwtKeyEvent.VK_HOME
private const val KEYCODE_MOVE_END = AwtKeyEvent.VK_END
private const val KEYCODE_INSERT = AwtKeyEvent.VK_INSERT
private const val KEYCODE_FORWARD = 125
private const val KEYCODE_MEDIA_PLAY = 126
private const val KEYCODE_MEDIA_PAUSE = 127
private const val KEYCODE_MEDIA_CLOSE = 128
private const val KEYCODE_MEDIA_EJECT = 129
private const val KEYCODE_MEDIA_RECORD = 130
private const val KEYCODE_F1 = AwtKeyEvent.VK_F1
private const val KEYCODE_F2 = AwtKeyEvent.VK_F2
private const val KEYCODE_F3 = AwtKeyEvent.VK_F3
private const val KEYCODE_F4 = AwtKeyEvent.VK_F4
private const val KEYCODE_F5 = AwtKeyEvent.VK_F5
private const val KEYCODE_F6 = AwtKeyEvent.VK_F6
private const val KEYCODE_F7 = AwtKeyEvent.VK_F7
private const val KEYCODE_F8 = AwtKeyEvent.VK_F8
private const val KEYCODE_F9 = AwtKeyEvent.VK_F9
private const val KEYCODE_F10 = AwtKeyEvent.VK_F10
private const val KEYCODE_F11 = AwtKeyEvent.VK_F11
private const val KEYCODE_F12 = AwtKeyEvent.VK_F12
private const val KEYCODE_NUM_LOCK = AwtKeyEvent.VK_NUM_LOCK
private const val KEYCODE_NUMPAD_0 = AwtKeyEvent.VK_NUMPAD0
private const val KEYCODE_NUMPAD_1 = AwtKeyEvent.VK_NUMPAD1
private const val KEYCODE_NUMPAD_2 = AwtKeyEvent.VK_NUMPAD2
private const val KEYCODE_NUMPAD_3 = AwtKeyEvent.VK_NUMPAD3
private const val KEYCODE_NUMPAD_4 = AwtKeyEvent.VK_NUMPAD4
private const val KEYCODE_NUMPAD_5 = AwtKeyEvent.VK_NUMPAD5
private const val KEYCODE_NUMPAD_6 = AwtKeyEvent.VK_NUMPAD6
private const val KEYCODE_NUMPAD_7 = AwtKeyEvent.VK_NUMPAD7
private const val KEYCODE_NUMPAD_8 = AwtKeyEvent.VK_NUMPAD8
private const val KEYCODE_NUMPAD_9 = AwtKeyEvent.VK_NUMPAD9
private const val KEYCODE_NUMPAD_DIVIDE = AwtKeyEvent.VK_DIVIDE
private const val KEYCODE_NUMPAD_MULTIPLY = AwtKeyEvent.VK_MULTIPLY
private const val KEYCODE_NUMPAD_SUBTRACT = AwtKeyEvent.VK_SUBTRACT
private const val KEYCODE_NUMPAD_ADD = AwtKeyEvent.VK_ADD
private const val KEYCODE_NUMPAD_DOT = AwtKeyEvent.VK_DECIMAL
private const val KEYCODE_NUMPAD_COMMA = AwtKeyEvent.VK_SEPARATOR
private const val KEYCODE_NUMPAD_ENTER = AwtKeyEvent.VK_ENTER
private const val KEYCODE_NUMPAD_EQUALS = AwtKeyEvent.VK_EQUALS
private const val KEYCODE_NUMPAD_LEFT_PAREN = AwtKeyEvent.VK_LEFT_PARENTHESIS
private const val KEYCODE_NUMPAD_RIGHT_PAREN = AwtKeyEvent.VK_RIGHT_PARENTHESIS
private const val KEYCODE_VOLUME_MUTE = 164
private const val KEYCODE_INFO = 165
private const val KEYCODE_CHANNEL_UP = 166
private const val KEYCODE_CHANNEL_DOWN = 167
private const val KEYCODE_ZOOM_IN = 168
private const val KEYCODE_ZOOM_OUT = 169
private const val KEYCODE_TV = 170
private const val KEYCODE_WINDOW = 171
private const val KEYCODE_GUIDE = 172
private const val KEYCODE_DVR = 173
private const val KEYCODE_BOOKMARK = 174
private const val KEYCODE_CAPTIONS = 175
private const val KEYCODE_SETTINGS = 176
private const val KEYCODE_TV_POWER = 177
private const val KEYCODE_TV_INPUT = 178
private const val KEYCODE_STB_POWER = 179
private const val KEYCODE_STB_INPUT = 180
private const val KEYCODE_AVR_POWER = 181
private const val KEYCODE_AVR_INPUT = 182
private const val KEYCODE_PROG_RED = 183
private const val KEYCODE_PROG_GREEN = 184
private const val KEYCODE_PROG_YELLOW = 185
private const val KEYCODE_PROG_BLUE = 186
private const val KEYCODE_APP_SWITCH = 187
private const val KEYCODE_BUTTON_1 = 188
private const val KEYCODE_BUTTON_2 = 189
private const val KEYCODE_BUTTON_3 = 190
private const val KEYCODE_BUTTON_4 = 191
private const val KEYCODE_BUTTON_5 = 192
private const val KEYCODE_BUTTON_6 = 193
private const val KEYCODE_BUTTON_7 = 194
private const val KEYCODE_BUTTON_8 = 195
private const val KEYCODE_BUTTON_9 = 196
private const val KEYCODE_BUTTON_10 = 197
private const val KEYCODE_BUTTON_11 = 198
private const val KEYCODE_BUTTON_12 = 199
private const val KEYCODE_BUTTON_13 = 200
private const val KEYCODE_BUTTON_14 = 201
private const val KEYCODE_BUTTON_15 = 202
private const val KEYCODE_BUTTON_16 = 203
private const val KEYCODE_LANGUAGE_SWITCH = 204
private const val KEYCODE_MANNER_MODE = 205
private const val KEYCODE_3D_MODE = 206
private const val KEYCODE_CONTACTS = 207
private const val KEYCODE_CALENDAR = 208
private const val KEYCODE_MUSIC = 209
private const val KEYCODE_CALCULATOR = 210
private const val KEYCODE_ZENKAKU_HANKAKU = AwtKeyEvent.VK_FULL_WIDTH
private const val KEYCODE_EISU = 212
private const val KEYCODE_MUHENKAN = AwtKeyEvent.VK_NONCONVERT
private const val KEYCODE_HENKAN = AwtKeyEvent.VK_CONVERT
private const val KEYCODE_KATAKANA_HIRAGANA = AwtKeyEvent.VK_HIRAGANA
private const val KEYCODE_YEN = 216
private const val KEYCODE_RO = 217
private const val KEYCODE_KANA = AwtKeyEvent.VK_KANA
private const val KEYCODE_ASSIST = 219
private const val KEYCODE_BRIGHTNESS_DOWN = 220
private const val KEYCODE_BRIGHTNESS_UP = 221
private const val KEYCODE_MEDIA_AUDIO_TRACK = 222
private const val KEYCODE_SLEEP = 223
private const val KEYCODE_WAKEUP = 224
private const val KEYCODE_PAIRING = 225
private const val KEYCODE_MEDIA_TOP_MENU = 226
private const val KEYCODE_11 = 227
private const val KEYCODE_12 = 228
private const val KEYCODE_LAST_CHANNEL = 229
private const val KEYCODE_TV_DATA_SERVICE = 230
private const val KEYCODE_VOICE_ASSIST = 231
private const val KEYCODE_TV_RADIO_SERVICE = 232
private const val KEYCODE_TV_TELETEXT = 233
private const val KEYCODE_TV_NUMBER_ENTRY = 234
private const val KEYCODE_TV_TERRESTRIAL_ANALOG = 235
private const val KEYCODE_TV_TERRESTRIAL_DIGITAL = 236
private const val KEYCODE_TV_SATELLITE = 237
private const val KEYCODE_TV_SATELLITE_BS = 238
private const val KEYCODE_TV_SATELLITE_CS = 239
private const val KEYCODE_TV_SATELLITE_SERVICE = 240
private const val KEYCODE_TV_NETWORK = 241
private const val KEYCODE_TV_ANTENNA_CABLE = 242
private const val KEYCODE_TV_INPUT_HDMI_1 = 243
private const val KEYCODE_TV_INPUT_HDMI_2 = 244
private const val KEYCODE_TV_INPUT_HDMI_3 = 245
private const val KEYCODE_TV_INPUT_HDMI_4 = 246
private const val KEYCODE_TV_INPUT_COMPOSITE_1 = 247
private const val KEYCODE_TV_INPUT_COMPOSITE_2 = 248
private const val KEYCODE_TV_INPUT_COMPONENT_1 = 249
private const val KEYCODE_TV_INPUT_COMPONENT_2 = 250
private const val KEYCODE_TV_INPUT_VGA_1 = 251
private const val KEYCODE_TV_AUDIO_DESCRIPTION = 252
private const val KEYCODE_TV_AUDIO_DESCRIPTION_MIX_UP = 253
private const val KEYCODE_TV_AUDIO_DESCRIPTION_MIX_DOWN = 254
private const val KEYCODE_TV_ZOOM_MODE = 255
private const val KEYCODE_TV_CONTENTS_MENU = 256
private const val KEYCODE_TV_MEDIA_CONTEXT_MENU = 257
private const val KEYCODE_TV_TIMER_PROGRAMMING = 258
private const val KEYCODE_HELP = AwtKeyEvent.VK_HELP
private const val KEYCODE_NAVIGATE_PREVIOUS = 259
private const val KEYCODE_NAVIGATE_NEXT = 260
private const val KEYCODE_NAVIGATE_IN = 261
private const val KEYCODE_NAVIGATE_OUT = 262
private const val KEYCODE_STEM_PRIMARY = 263
private const val KEYCODE_STEM_1 = 264
private const val KEYCODE_STEM_2 = 265
private const val KEYCODE_STEM_3 = 266
private const val KEYCODE_MEDIA_SKIP_FORWARD = 272
private const val KEYCODE_MEDIA_SKIP_BACKWARD = 273
private const val KEYCODE_MEDIA_STEP_FORWARD = 274
private const val KEYCODE_MEDIA_STEP_BACKWARD = 275
private const val KEYCODE_SOFT_SLEEP = 276
private const val KEYCODE_CUT = AwtKeyEvent.VK_CUT
private const val KEYCODE_COPY = AwtKeyEvent.VK_COPY
private const val KEYCODE_PASTE = AwtKeyEvent.VK_PASTE
private const val KEYCODE_SYSTEM_NAVIGATION_UP = 280
private const val KEYCODE_SYSTEM_NAVIGATION_DOWN = 281
private const val KEYCODE_SYSTEM_NAVIGATION_LEFT = 282
private const val KEYCODE_SYSTEM_NAVIGATION_RIGHT = 283
private const val KEYCODE_ALL_APPS = 284
private const val KEYCODE_REFRESH = 285
private const val KEYCODE_THUMBS_UP = 286
private const val KEYCODE_THUMBS_DOWN = 287
private const val KEYCODE_PROFILE_SWITCH = 288
private const val KEYCODE_BACK = AwtKeyEvent.VK_BACK_SPACE

/**
 * Actual implementation of [Key] for Android.
 *
 * @param keyCode an integer code representing the key pressed.
 *
 * @sample com.tencent.kuikly.compose.ui.samples.KeyEventIsAltPressedSample
 */
@JvmInline
actual value class Key(val keyCode: Long) {
    actual companion object {
        /** Unknown key. */
        actual val Unknown = Key(KEYCODE_UNKNOWN)

        /**
         * Soft Left key.
         *
         * Usually situated below the display on phones and used as a multi-function
         * feature key for selecting a software defined function shown on the bottom left
         * of the display.
         */
        actual val SoftLeft = Key(KEYCODE_SOFT_LEFT)

        /**
         * Soft Right key.
         *
         * Usually situated below the display on phones and used as a multi-function
         * feature key for selecting a software defined function shown on the bottom right
         * of the display.
         */
        actual val SoftRight = Key(KEYCODE_SOFT_RIGHT)

        /**
         * Home key.
         *
         * This key is handled by the framework and is never delivered to applications.
         */
        actual val Home = Key(KEYCODE_HOME)

        /** Back key. */
        actual val Back = Key(KEYCODE_BACK)

        /** Help key. */
        actual val Help = Key(KEYCODE_HELP)

        /**
         * Navigate to previous key.
         *
         * Goes backward by one item in an ordered collection of items.
         */
        actual val NavigatePrevious = Key(KEYCODE_NAVIGATE_PREVIOUS)

        /**
         * Navigate to next key.
         *
         * Advances to the next item in an ordered collection of items.
         */
        actual val NavigateNext = Key(KEYCODE_NAVIGATE_NEXT)

        /**
         * Navigate in key.
         *
         * Activates the item that currently has focus or expands to the next level of a navigation
         * hierarchy.
         */
        actual val NavigateIn = Key(KEYCODE_NAVIGATE_IN)

        /**
         * Navigate out key.
         *
         * Backs out one level of a navigation hierarchy or collapses the item that currently has
         * focus.
         */
        actual val NavigateOut = Key(KEYCODE_NAVIGATE_OUT)

        /** Consumed by the system for navigation up. */
        actual val SystemNavigationUp = Key(KEYCODE_SYSTEM_NAVIGATION_UP)

        /** Consumed by the system for navigation down. */
        actual val SystemNavigationDown = Key(KEYCODE_SYSTEM_NAVIGATION_DOWN)

        /** Consumed by the system for navigation left. */
        actual val SystemNavigationLeft = Key(KEYCODE_SYSTEM_NAVIGATION_LEFT)

        /** Consumed by the system for navigation right. */
        actual val SystemNavigationRight = Key(KEYCODE_SYSTEM_NAVIGATION_RIGHT)

        /** Call key. */
        actual val Call = Key(KEYCODE_CALL)

        /** End Call key. */
        actual val EndCall = Key(KEYCODE_ENDCALL)

        /**
         * Up Arrow Key / Directional Pad Up key.
         *
         * May also be synthesized from trackball motions.
         */
        actual val DirectionUp = Key(KEYCODE_DPAD_UP)

        /**
         * Down Arrow Key / Directional Pad Down key.
         *
         * May also be synthesized from trackball motions.
         */
        actual val DirectionDown = Key(KEYCODE_DPAD_DOWN)

        /**
         * Left Arrow Key / Directional Pad Left key.
         *
         * May also be synthesized from trackball motions.
         */
        actual val DirectionLeft = Key(KEYCODE_DPAD_LEFT)

        /**
         * Right Arrow Key / Directional Pad Right key.
         *
         * May also be synthesized from trackball motions.
         */
        actual val DirectionRight = Key(KEYCODE_DPAD_RIGHT)

        /**
         * Center Arrow Key / Directional Pad Center key.
         *
         * May also be synthesized from trackball motions.
         */
        actual val DirectionCenter = Key(KEYCODE_DPAD_CENTER)

        /** Directional Pad Up-Left. */
        actual val DirectionUpLeft = Key(KEYCODE_DPAD_UP_LEFT)

        /** Directional Pad Down-Left. */
        actual val DirectionDownLeft = Key(KEYCODE_DPAD_DOWN_LEFT)

        /** Directional Pad Up-Right. */
        actual val DirectionUpRight = Key(KEYCODE_DPAD_UP_RIGHT)

        /** Directional Pad Down-Right. */
        actual val DirectionDownRight = Key(KEYCODE_DPAD_DOWN_RIGHT)

        /**
         * Volume Up key.
         *
         * Adjusts the speaker volume up.
         */
        actual val VolumeUp = Key(KEYCODE_VOLUME_UP)

        /**
         * Volume Down key.
         *
         * Adjusts the speaker volume down.
         */
        actual val VolumeDown = Key(KEYCODE_VOLUME_DOWN)

        /** Power key.  */
        actual val Power = Key(KEYCODE_POWER)

        /**
         * Camera key.
         *
         * Used to launch a camera application or take pictures.
         */
        actual val Camera = Key(KEYCODE_CAMERA)

        /** Clear key. */
        actual val Clear = Key(KEYCODE_CLEAR)

        /** '0' key. */
        actual val Zero = Key(KEYCODE_0)

        /** '1' key. */
        actual val One = Key(KEYCODE_1)

        /** '2' key. */
        actual val Two = Key(KEYCODE_2)

        /** '3' key. */
        actual val Three = Key(KEYCODE_3)

        /** '4' key. */
        actual val Four = Key(KEYCODE_4)

        /** '5' key. */
        actual val Five = Key(KEYCODE_5)

        /** '6' key. */
        actual val Six = Key(KEYCODE_6)

        /** '7' key. */
        actual val Seven = Key(KEYCODE_7)

        /** '8' key. */
        actual val Eight = Key(KEYCODE_8)

        /** '9' key. */
        actual val Nine = Key(KEYCODE_9)

        /** '+' key. */
        actual val Plus = Key(KEYCODE_PLUS)

        /** '-' key. */
        actual val Minus = Key(KEYCODE_MINUS)

        /** '*' key. */
        actual val Multiply = Key(KEYCODE_STAR)

        /** '=' key. */
        actual val Equals = Key(KEYCODE_EQUALS)

        /** '#' key. */
        actual val Pound = Key(KEYCODE_POUND)

        /** 'A' key. */
        actual val A = Key(KEYCODE_A)

        /** 'B' key. */
        actual val B = Key(KEYCODE_B)

        /** 'C' key. */
        actual val C = Key(KEYCODE_C)

        /** 'D' key. */
        actual val D = Key(KEYCODE_D)

        /** 'E' key. */
        actual val E = Key(KEYCODE_E)

        /** 'F' key. */
        actual val F = Key(KEYCODE_F)

        /** 'G' key. */
        actual val G = Key(KEYCODE_G)

        /** 'H' key. */
        actual val H = Key(KEYCODE_H)

        /** 'I' key. */
        actual val I = Key(KEYCODE_I)

        /** 'J' key. */
        actual val J = Key(KEYCODE_J)

        /** 'K' key. */
        actual val K = Key(KEYCODE_K)

        /** 'L' key. */
        actual val L = Key(KEYCODE_L)

        /** 'M' key. */
        actual val M = Key(KEYCODE_M)

        /** 'N' key. */
        actual val N = Key(KEYCODE_N)

        /** 'O' key. */
        actual val O = Key(KEYCODE_O)

        /** 'P' key. */
        actual val P = Key(KEYCODE_P)

        /** 'Q' key. */
        actual val Q = Key(KEYCODE_Q)

        /** 'R' key. */
        actual val R = Key(KEYCODE_R)

        /** 'S' key. */
        actual val S = Key(KEYCODE_S)

        /** 'T' key. */
        actual val T = Key(KEYCODE_T)

        /** 'U' key. */
        actual val U = Key(KEYCODE_U)

        /** 'V' key. */
        actual val V = Key(KEYCODE_V)

        /** 'W' key. */
        actual val W = Key(KEYCODE_W)

        /** 'X' key. */
        actual val X = Key(KEYCODE_X)

        /** 'Y' key. */
        actual val Y = Key(KEYCODE_Y)

        /** 'Z' key. */
        actual val Z = Key(KEYCODE_Z)

        /** ',' key. */
        actual val Comma = Key(KEYCODE_COMMA)

        /** '.' key. */
        actual val Period = Key(KEYCODE_PERIOD)

        /** Left Alt modifier key. */
        actual val AltLeft = Key(KEYCODE_ALT_LEFT)

        /** Right Alt modifier key. */
        actual val AltRight = Key(KEYCODE_ALT_RIGHT)

        /** Left Shift modifier key. */
        actual val ShiftLeft = Key(KEYCODE_SHIFT_LEFT)

        /** Right Shift modifier key. */
        actual val ShiftRight = Key(KEYCODE_SHIFT_RIGHT)

        /** Tab key. */
        actual val Tab = Key(KEYCODE_TAB)

        /** Space key. */
        actual val Spacebar = Key(KEYCODE_SPACE)

        /**
         * Symbol modifier key.
         *
         * Used to enter alternate symbols.
         */
        actual val Symbol = Key(KEYCODE_SYM)

        /**
         * Browser special function key.
         *
         * Used to launch a browser application.
         */
        actual val Browser = Key(KEYCODE_EXPLORER)

        /**
         * Envelope special function key.
         *
         * Used to launch a mail application.
         */
        actual val Envelope = Key(KEYCODE_ENVELOPE)

        /** Enter key. */
        actual val Enter = Key(KEYCODE_ENTER)

        /**
         * Backspace key.
         *
         * Deletes characters before the insertion point, unlike [Delete].
         */
        actual val Backspace = Key(KEYCODE_DEL)

        /**
         * Delete key.
         *
         * Deletes characters ahead of the insertion point, unlike [Backspace].
         */
        actual val Delete = Key(KEYCODE_FORWARD_DEL)

        /** Escape key. */
        actual val Escape = Key(KEYCODE_ESCAPE)

        /** Left Control modifier key. */
        actual val CtrlLeft = Key(KEYCODE_CTRL_LEFT)

        /** Right Control modifier key. */
        actual val CtrlRight = Key(KEYCODE_CTRL_RIGHT)

        /** Caps Lock key. */
        actual val CapsLock = Key(KEYCODE_CAPS_LOCK)

        /** Scroll Lock key. */
        actual val ScrollLock = Key(KEYCODE_SCROLL_LOCK)

        /** Left Meta modifier key. */
        actual val MetaLeft = Key(KEYCODE_META_LEFT)

        /** Right Meta modifier key. */
        actual val MetaRight = Key(KEYCODE_META_RIGHT)

        /** Function modifier key. */
        actual val Function = Key(KEYCODE_FUNCTION)

        /** System Request / Print Screen key. */
        actual val PrintScreen = Key(KEYCODE_SYSRQ)

        /** Break / Pause key. */
        actual val Break = Key(KEYCODE_BREAK)

        /**
         * Home Movement key.
         *
         * Used for scrolling or moving the cursor around to the start of a line
         * or to the top of a list.
         */
        actual val MoveHome = Key(KEYCODE_MOVE_HOME)

        /**
         * End Movement key.
         *
         * Used for scrolling or moving the cursor around to the end of a line
         * or to the bottom of a list.
         */
        actual val MoveEnd = Key(KEYCODE_MOVE_END)

        /**
         * Insert key.
         *
         * Toggles insert / overwrite edit mode.
         */
        actual val Insert = Key(KEYCODE_INSERT)

        /** Cut key. */
        actual val Cut = Key(KEYCODE_CUT)

        /** Copy key. */
        actual val Copy = Key(KEYCODE_COPY)

        /** Paste key. */
        actual val Paste = Key(KEYCODE_PASTE)

        /** '`' (backtick) key. */
        actual val Grave = Key(KEYCODE_GRAVE)

        /** '[' key. */
        actual val LeftBracket = Key(KEYCODE_LEFT_BRACKET)

        /** ']' key. */
        actual val RightBracket = Key(KEYCODE_RIGHT_BRACKET)

        /** '/' key. */
        actual val Slash = Key(KEYCODE_SLASH)

        /** '\' key. */
        actual val Backslash = Key(KEYCODE_BACKSLASH)

        /** ';' key. */
        actual val Semicolon = Key(KEYCODE_SEMICOLON)

        /** ''' (apostrophe) key. */
        actual val Apostrophe = Key(KEYCODE_APOSTROPHE)

        /** '@' key. */
        actual val At = Key(KEYCODE_AT)

        /**
         * Number modifier key.
         *
         * Used to enter numeric symbols.
         * This key is not Num Lock; it is more like  [AltLeft].
         */
        actual val Number = Key(KEYCODE_NUM)

        /**
         * Headset Hook key.
         *
         * Used to hang up calls and stop media.
         */
        actual val HeadsetHook = Key(KEYCODE_HEADSETHOOK)

        /**
         * Camera Focus key.
         *
         * Used to focus the camera.
         */
        actual val Focus = Key(KEYCODE_FOCUS)

        /** Menu key. */
        actual val Menu = Key(KEYCODE_MENU)

        /** Notification key. */
        actual val Notification = Key(KEYCODE_NOTIFICATION)

        /** Search key. */
        actual val Search = Key(KEYCODE_SEARCH)

        /** Page Up key. */
        actual val PageUp = Key(KEYCODE_PAGE_UP)

        /** Page Down key. */
        actual val PageDown = Key(KEYCODE_PAGE_DOWN)

        /**
         * Picture Symbols modifier key.
         *
         * Used to switch symbol sets (Emoji, Kao-moji).
         */
        actual val PictureSymbols = Key(KEYCODE_PICTSYMBOLS)

        /**
         * Switch Charset modifier key.
         *
         * Used to switch character sets (Kanji, Katakana).
         */
        actual val SwitchCharset = Key(KEYCODE_SWITCH_CHARSET)

        /**
         * A Button key.
         *
         * On a game controller, the A button should be either the button labeled A
         * or the first button on the bottom row of controller buttons.
         */
        actual val ButtonA = Key(KEYCODE_BUTTON_A)

        /**
         * B Button key.
         *
         * On a game controller, the B button should be either the button labeled B
         * or the second button on the bottom row of controller buttons.
         */
        actual val ButtonB = Key(KEYCODE_BUTTON_B)

        /**
         * C Button key.
         *
         * On a game controller, the C button should be either the button labeled C
         * or the third button on the bottom row of controller buttons.
         */
        actual val ButtonC = Key(KEYCODE_BUTTON_C)

        /**
         * X Button key.
         *
         * On a game controller, the X button should be either the button labeled X
         * or the first button on the upper row of controller buttons.
         */
        actual val ButtonX = Key(KEYCODE_BUTTON_X)

        /**
         * Y Button key.
         *
         * On a game controller, the Y button should be either the button labeled Y
         * or the second button on the upper row of controller buttons.
         */
        actual val ButtonY = Key(KEYCODE_BUTTON_Y)

        /**
         * Z Button key.
         *
         * On a game controller, the Z button should be either the button labeled Z
         * or the third button on the upper row of controller buttons.
         */
        actual val ButtonZ = Key(KEYCODE_BUTTON_Z)

        /**
         * L1 Button key.
         *
         * On a game controller, the L1 button should be either the button labeled L1 (or L)
         * or the top left trigger button.
         */
        actual val ButtonL1 = Key(KEYCODE_BUTTON_L1)

        /**
         * R1 Button key.
         *
         * On a game controller, the R1 button should be either the button labeled R1 (or R)
         * or the top right trigger button.
         */
        actual val ButtonR1 = Key(KEYCODE_BUTTON_R1)

        /**
         * L2 Button key.
         *
         * On a game controller, the L2 button should be either the button labeled L2
         * or the bottom left trigger button.
         */
        actual val ButtonL2 = Key(KEYCODE_BUTTON_L2)

        /**
         * R2 Button key.
         *
         * On a game controller, the R2 button should be either the button labeled R2
         * or the bottom right trigger button.
         */
        actual val ButtonR2 = Key(KEYCODE_BUTTON_R2)

        /**
         * Left Thumb Button key.
         *
         * On a game controller, the left thumb button indicates that the left (or only)
         * joystick is pressed.
         */
        actual val ButtonThumbLeft = Key(KEYCODE_BUTTON_THUMBL)

        /**
         * Right Thumb Button key.
         *
         * On a game controller, the right thumb button indicates that the right
         * joystick is pressed.
         */
        actual val ButtonThumbRight = Key(KEYCODE_BUTTON_THUMBR)

        /**
         * Start Button key.
         *
         * On a game controller, the button labeled Start.
         */
        actual val ButtonStart = Key(KEYCODE_BUTTON_START)

        /**
         * Select Button key.
         *
         * On a game controller, the button labeled Select.
         */
        actual val ButtonSelect = Key(KEYCODE_BUTTON_SELECT)

        /**
         * Mode Button key.
         *
         * On a game controller, the button labeled Mode.
         */
        actual val ButtonMode = Key(KEYCODE_BUTTON_MODE)

        /** Generic Game Pad Button #1. */
        actual val Button1 = Key(KEYCODE_BUTTON_1)

        /** Generic Game Pad Button #2. */
        actual val Button2 = Key(KEYCODE_BUTTON_2)

        /** Generic Game Pad Button #3. */
        actual val Button3 = Key(KEYCODE_BUTTON_3)

        /** Generic Game Pad Button #4. */
        actual val Button4 = Key(KEYCODE_BUTTON_4)

        /** Generic Game Pad Button #5. */
        actual val Button5 = Key(KEYCODE_BUTTON_5)

        /** Generic Game Pad Button #6. */
        actual val Button6 = Key(KEYCODE_BUTTON_6)

        /** Generic Game Pad Button #7. */
        actual val Button7 = Key(KEYCODE_BUTTON_7)

        /** Generic Game Pad Button #8. */
        actual val Button8 = Key(KEYCODE_BUTTON_8)

        /** Generic Game Pad Button #9. */
        actual val Button9 = Key(KEYCODE_BUTTON_9)

        /** Generic Game Pad Button #10. */
        actual val Button10 = Key(KEYCODE_BUTTON_10)

        /** Generic Game Pad Button #11. */
        actual val Button11 = Key(KEYCODE_BUTTON_11)

        /** Generic Game Pad Button #12. */
        actual val Button12 = Key(KEYCODE_BUTTON_12)

        /** Generic Game Pad Button #13. */
        actual val Button13 = Key(KEYCODE_BUTTON_13)

        /** Generic Game Pad Button #14. */
        actual val Button14 = Key(KEYCODE_BUTTON_14)

        /** Generic Game Pad Button #15. */
        actual val Button15 = Key(KEYCODE_BUTTON_15)

        /** Generic Game Pad Button #16. */
        actual val Button16 = Key(KEYCODE_BUTTON_16)

        /**
         * Forward key.
         *
         * Navigates forward in the history stack. Complement of [Back].
         */
        actual val Forward = Key(KEYCODE_FORWARD)

        /** F1 key. */
        actual val F1 = Key(KEYCODE_F1)

        /** F2 key. */
        actual val F2 = Key(KEYCODE_F2)

        /** F3 key. */
        actual val F3 = Key(KEYCODE_F3)

        /** F4 key. */
        actual val F4 = Key(KEYCODE_F4)

        /** F5 key. */
        actual val F5 = Key(KEYCODE_F5)

        /** F6 key. */
        actual val F6 = Key(KEYCODE_F6)

        /** F7 key. */
        actual val F7 = Key(KEYCODE_F7)

        /** F8 key. */
        actual val F8 = Key(KEYCODE_F8)

        /** F9 key. */
        actual val F9 = Key(KEYCODE_F9)

        /** F10 key. */
        actual val F10 = Key(KEYCODE_F10)

        /** F11 key. */
        actual val F11 = Key(KEYCODE_F11)

        /** F12 key. */
        actual val F12 = Key(KEYCODE_F12)

        /**
         * Num Lock key.
         *
         * This is the Num Lock key; it is different from [Number].
         * This key alters the behavior of other keys on the numeric keypad.
         */
        actual val NumLock = Key(KEYCODE_NUM_LOCK)

        /** Numeric keypad '0' key. */
        actual val NumPad0 = Key(KEYCODE_NUMPAD_0)

        /** Numeric keypad '1' key. */
        actual val NumPad1 = Key(KEYCODE_NUMPAD_1)

        /** Numeric keypad '2' key. */
        actual val NumPad2 = Key(KEYCODE_NUMPAD_2)

        /** Numeric keypad '3' key. */
        actual val NumPad3 = Key(KEYCODE_NUMPAD_3)

        /** Numeric keypad '4' key. */
        actual val NumPad4 = Key(KEYCODE_NUMPAD_4)

        /** Numeric keypad '5' key. */
        actual val NumPad5 = Key(KEYCODE_NUMPAD_5)

        /** Numeric keypad '6' key. */
        actual val NumPad6 = Key(KEYCODE_NUMPAD_6)

        /** Numeric keypad '7' key. */
        actual val NumPad7 = Key(KEYCODE_NUMPAD_7)

        /** Numeric keypad '8' key. */
        actual val NumPad8 = Key(KEYCODE_NUMPAD_8)

        /** Numeric keypad '9' key. */
        actual val NumPad9 = Key(KEYCODE_NUMPAD_9)

        /** Numeric keypad '/' key (for division). */
        actual val NumPadDivide = Key(KEYCODE_NUMPAD_DIVIDE)

        /** Numeric keypad '*' key (for multiplication). */
        actual val NumPadMultiply = Key(KEYCODE_NUMPAD_MULTIPLY)

        /** Numeric keypad '-' key (for subtraction). */
        actual val NumPadSubtract = Key(KEYCODE_NUMPAD_SUBTRACT)

        /** Numeric keypad '+' key (for addition). */
        actual val NumPadAdd = Key(KEYCODE_NUMPAD_ADD)

        /** Numeric keypad '.' key (for decimals or digit grouping). */
        actual val NumPadDot = Key(KEYCODE_NUMPAD_DOT)

        /** Numeric keypad ',' key (for decimals or digit grouping). */
        actual val NumPadComma = Key(KEYCODE_NUMPAD_COMMA)

        /** Numeric keypad Enter key. */
        actual val NumPadEnter = Key(KEYCODE_NUMPAD_ENTER)

        /** Numeric keypad '=' key. */
        actual val NumPadEquals = Key(KEYCODE_NUMPAD_EQUALS)

        /** Numeric keypad '(' key. */
        actual val NumPadLeftParenthesis = Key(KEYCODE_NUMPAD_LEFT_PAREN)

        /** Numeric keypad ')' key. */
        actual val NumPadRightParenthesis = Key(KEYCODE_NUMPAD_RIGHT_PAREN)

        /** Play media key. */
        actual val MediaPlay = Key(KEYCODE_MEDIA_PLAY)

        /** Pause media key. */
        actual val MediaPause = Key(KEYCODE_MEDIA_PAUSE)

        /** Play/Pause media key. */
        actual val MediaPlayPause = Key(KEYCODE_MEDIA_PLAY_PAUSE)

        /** Stop media key. */
        actual val MediaStop = Key(KEYCODE_MEDIA_STOP)

        /** Record media key. */
        actual val MediaRecord = Key(KEYCODE_MEDIA_RECORD)

        /** Play Next media key. */
        actual val MediaNext = Key(KEYCODE_MEDIA_NEXT)

        /** Play Previous media key. */
        actual val MediaPrevious = Key(KEYCODE_MEDIA_PREVIOUS)

        /** Rewind media key. */
        actual val MediaRewind = Key(KEYCODE_MEDIA_REWIND)

        /** Fast Forward media key. */
        actual val MediaFastForward = Key(KEYCODE_MEDIA_FAST_FORWARD)

        /**
         * Close media key.
         *
         * May be used to close a CD tray, for example.
         */
        actual val MediaClose = Key(KEYCODE_MEDIA_CLOSE)

        /**
         * Audio Track key.
         *
         * Switches the audio tracks.
         */
        actual val MediaAudioTrack = Key(KEYCODE_MEDIA_AUDIO_TRACK)

        /**
         * Eject media key.
         *
         * May be used to eject a CD tray, for example.
         */
        actual val MediaEject = Key(KEYCODE_MEDIA_EJECT)

        /**
         * Media Top Menu key.
         *
         * Goes to the top of media menu.
         */
        actual val MediaTopMenu = Key(KEYCODE_MEDIA_TOP_MENU)

        /** Skip forward media key. */
        actual val MediaSkipForward = Key(KEYCODE_MEDIA_SKIP_FORWARD)

        /** Skip backward media key. */
        actual val MediaSkipBackward = Key(KEYCODE_MEDIA_SKIP_BACKWARD)

        /**
         * Step forward media key.
         *
         * Steps media forward, one frame at a time.
         */
        actual val MediaStepForward = Key(KEYCODE_MEDIA_STEP_FORWARD)

        /**
         * Step backward media key.
         *
         * Steps media backward, one frame at a time.
         */
        actual val MediaStepBackward = Key(KEYCODE_MEDIA_STEP_BACKWARD)

        /**
         * Mute key.
         *
         * Mutes the microphone, unlike [VolumeMute].
         */
        actual val MicrophoneMute = Key(KEYCODE_MUTE)

        /**
         * Volume Mute key.
         *
         * Mutes the speaker, unlike [MicrophoneMute].
         *
         * This key should normally be implemented as a toggle such that the first press
         * mutes the speaker and the second press restores the original volume.
         */
        actual val VolumeMute = Key(KEYCODE_VOLUME_MUTE)

        /**
         * Info key.
         *
         * Common on TV remotes to show additional information related to what is
         * currently being viewed.
         */
        actual val Info = Key(KEYCODE_INFO)

        /**
         * Channel up key.
         *
         * On TV remotes, increments the television channel.
         */
        actual val ChannelUp = Key(KEYCODE_CHANNEL_UP)

        /**
         * Channel down key.
         *
         * On TV remotes, decrements the television channel.
         */
        actual val ChannelDown = Key(KEYCODE_CHANNEL_DOWN)

        /** Zoom in key. */
        actual val ZoomIn = Key(KEYCODE_ZOOM_IN)

        /** Zoom out key. */
        actual val ZoomOut = Key(KEYCODE_ZOOM_OUT)

        /**
         * TV key.
         *
         * On TV remotes, switches to viewing live TV.
         */
        actual val Tv = Key(KEYCODE_TV)

        /**
         * Window key.
         *
         * On TV remotes, toggles picture-in-picture mode or other windowing functions.
         * On Android Wear devices, triggers a display offset.
         */
        actual val Window = Key(KEYCODE_WINDOW)

        /**
         * Guide key.
         *
         * On TV remotes, shows a programming guide.
         */
        actual val Guide = Key(KEYCODE_GUIDE)

        /**
         * DVR key.
         *
         * On some TV remotes, switches to a DVR mode for recorded shows.
         */
        actual val Dvr = Key(KEYCODE_DVR)

        /**
         * Bookmark key.
         *
         * On some TV remotes, bookmarks content or web pages.
         */
        actual val Bookmark = Key(KEYCODE_BOOKMARK)

        /**
         * Toggle captions key.
         *
         * Switches the mode for closed-captioning text, for example during television shows.
         */
        actual val Captions = Key(KEYCODE_CAPTIONS)

        /**
         * Settings key.
         *
         * Starts the system settings activity.
         */
        actual val Settings = Key(KEYCODE_SETTINGS)

        /**
         * TV power key.
         *
         * On TV remotes, toggles the power on a television screen.
         */
        actual val TvPower = Key(KEYCODE_TV_POWER)

        /**
         * TV input key.
         *
         * On TV remotes, switches the input on a television screen.
         */
        actual val TvInput = Key(KEYCODE_TV_INPUT)

        /**
         * Set-top-box power key.
         *
         * On TV remotes, toggles the power on an external Set-top-box.
         */
        actual val SetTopBoxPower = Key(KEYCODE_STB_POWER)

        /**
         * Set-top-box input key.
         *
         * On TV remotes, switches the input mode on an external Set-top-box.
         */
        actual val SetTopBoxInput = Key(KEYCODE_STB_INPUT)

        /**
         * A/V Receiver power key.
         *
         * On TV remotes, toggles the power on an external A/V Receiver.
         */
        actual val AvReceiverPower = Key(KEYCODE_AVR_POWER)

        /**
         * A/V Receiver input key.
         *
         * On TV remotes, switches the input mode on an external A/V Receiver.
         */
        actual val AvReceiverInput = Key(KEYCODE_AVR_INPUT)

        /**
         * Red "programmable" key.
         *
         * On TV remotes, acts as a contextual/programmable key.
         */
        actual val ProgramRed = Key(KEYCODE_PROG_RED)

        /**
         * Green "programmable" key.
         *
         * On TV remotes, acts as a contextual/programmable key.
         */
        actual val ProgramGreen = Key(KEYCODE_PROG_GREEN)

        /**
         * Yellow "programmable" key.
         *
         * On TV remotes, acts as a contextual/programmable key.
         */
        actual val ProgramYellow = Key(KEYCODE_PROG_YELLOW)

        /**
         * Blue "programmable" key.
         *
         * On TV remotes, acts as a contextual/programmable key.
         */
        actual val ProgramBlue = Key(KEYCODE_PROG_BLUE)

        /**
         * App switch key.
         *
         * Should bring up the application switcher dialog.
         */
        actual val AppSwitch = Key(KEYCODE_APP_SWITCH)

        /**
         * Language Switch key.
         *
         * Toggles the current input language such as switching between English and Japanese on
         * a QWERTY keyboard.  On some devices, the same function may be performed by
         * pressing Shift+Space.
         */
        actual val LanguageSwitch = Key(KEYCODE_LANGUAGE_SWITCH)

        /**
         * Manner Mode key.
         *
         * Toggles silent or vibrate mode on and off to make the device behave more politely
         * in certain settings such as on a crowded train.  On some devices, the key may only
         * operate when long-pressed.
         */
        actual val MannerMode = Key(KEYCODE_MANNER_MODE)

        /**
         * 3D Mode key.
         *
         * Toggles the display between 2D and 3D mode.
         */
        actual val Toggle2D3D = Key(KEYCODE_3D_MODE)

        /**
         * Contacts special function key.
         *
         * Used to launch an address book application.
         */
        actual val Contacts = Key(KEYCODE_CONTACTS)

        /**
         * Calendar special function key.
         *
         * Used to launch a calendar application.
         */
        actual val Calendar = Key(KEYCODE_CALENDAR)

        /**
         * Music special function key.
         *
         * Used to launch a music player application.
         */
        actual val Music = Key(KEYCODE_MUSIC)

        /**
         * Calculator special function key.
         *
         * Used to launch a calculator application.
         */
        actual val Calculator = Key(KEYCODE_CALCULATOR)

        /** Japanese full-width / half-width key. */
        actual val ZenkakuHankaru = Key(KEYCODE_ZENKAKU_HANKAKU)

        /** Japanese alphanumeric key. */
        actual val Eisu = Key(KEYCODE_EISU)

        /** Japanese non-conversion key. */
        actual val Muhenkan = Key(KEYCODE_MUHENKAN)

        /** Japanese conversion key. */
        actual val Henkan = Key(KEYCODE_HENKAN)

        /** Japanese katakana / hiragana key. */
        actual val KatakanaHiragana = Key(KEYCODE_KATAKANA_HIRAGANA)

        /** Japanese Yen key. */
        actual val Yen = Key(KEYCODE_YEN)

        /** Japanese Ro key. */
        actual val Ro = Key(KEYCODE_RO)

        /** Japanese kana key. */
        actual val Kana = Key(KEYCODE_KANA)

        /**
         * Assist key.
         *
         * Launches the global assist activity.  Not delivered to applications.
         */
        actual val Assist = Key(KEYCODE_ASSIST)

        /**
         * Brightness Down key.
         *
         * Adjusts the screen brightness down.
         */
        actual val BrightnessDown = Key(KEYCODE_BRIGHTNESS_DOWN)

        /**
         * Brightness Up key.
         *
         * Adjusts the screen brightness up.
         */
        actual val BrightnessUp = Key(KEYCODE_BRIGHTNESS_UP)

        /**
         * Sleep key.
         *
         * Puts the device to sleep. Behaves somewhat like [Power] but it
         * has no effect if the device is already asleep.
         */
        actual val Sleep = Key(KEYCODE_SLEEP)

        /**
         * Wakeup key.
         *
         * Wakes up the device.  Behaves somewhat like [Power] but it
         * has no effect if the device is already awake.
         */
        actual val WakeUp = Key(KEYCODE_WAKEUP)

        /** Put device to sleep unless a wakelock is held.  */
        actual val SoftSleep = Key(KEYCODE_SOFT_SLEEP)

        /**
         * Pairing key.
         *
         * Initiates peripheral pairing mode. Useful for pairing remote control
         * devices or game controllers, especially if no other input mode is
         * available.
         */
        actual val Pairing = Key(KEYCODE_PAIRING)

        /**
         * Last Channel key.
         *
         * Goes to the last viewed channel.
         */
        actual val LastChannel = Key(KEYCODE_LAST_CHANNEL)

        /**
         * TV data service key.
         *
         * Displays data services like weather, sports.
         */
        actual val TvDataService = Key(KEYCODE_TV_DATA_SERVICE)

        /**
         * Voice Assist key.
         *
         * Launches the global voice assist activity. Not delivered to applications.
         */
        actual val VoiceAssist = Key(KEYCODE_VOICE_ASSIST)

        /**
         * Radio key.
         *
         * Toggles TV service / Radio service.
         */
        actual val TvRadioService = Key(KEYCODE_TV_RADIO_SERVICE)

        /**
         * Teletext key.
         *
         * Displays Teletext service.
         */
        actual val TvTeletext = Key(KEYCODE_TV_TELETEXT)

        /**
         * Number entry key.
         *
         * Initiates to enter multi-digit channel number when each digit key is assigned
         * for selecting separate channel. Corresponds to Number Entry Mode (0x1D) of CEC
         * User Control Code.
         */
        actual val TvNumberEntry = Key(KEYCODE_TV_NUMBER_ENTRY)

        /**
         * Analog Terrestrial key.
         *
         * Switches to analog terrestrial broadcast service.
         */
        actual val TvTerrestrialAnalog = Key(KEYCODE_TV_TERRESTRIAL_ANALOG)

        /**
         * Digital Terrestrial key.
         *
         * Switches to digital terrestrial broadcast service.
         */
        actual val TvTerrestrialDigital = Key(KEYCODE_TV_TERRESTRIAL_DIGITAL)

        /**
         * Satellite key.
         *
         * Switches to digital satellite broadcast service.
         */
        actual val TvSatellite = Key(KEYCODE_TV_SATELLITE)

        /**
         * BS key.
         *
         * Switches to BS digital satellite broadcasting service available in Japan.
         */
        actual val TvSatelliteBs = Key(KEYCODE_TV_SATELLITE_BS)

        /**
         * CS key.
         *
         * Switches to CS digital satellite broadcasting service available in Japan.
         */
        actual val TvSatelliteCs = Key(KEYCODE_TV_SATELLITE_CS)

        /**
         * BS/CS key.
         *
         * Toggles between BS and CS digital satellite services.
         */
        actual val TvSatelliteService = Key(KEYCODE_TV_SATELLITE_SERVICE)

        /**
         * Toggle Network key.
         *
         * Toggles selecting broadcast services.
         */
        actual val TvNetwork = Key(KEYCODE_TV_NETWORK)

        /**
         * Antenna/Cable key.
         *
         * Toggles broadcast input source between antenna and cable.
         */
        actual val TvAntennaCable = Key(KEYCODE_TV_ANTENNA_CABLE)

        /**
         * HDMI #1 key.
         *
         * Switches to HDMI input #1.
         */
        actual val TvInputHdmi1 = Key(KEYCODE_TV_INPUT_HDMI_1)

        /**
         * HDMI #2 key.
         *
         * Switches to HDMI input #2.
         */
        actual val TvInputHdmi2 = Key(KEYCODE_TV_INPUT_HDMI_2)

        /**
         * HDMI #3 key.
         *
         * Switches to HDMI input #3.
         */
        actual val TvInputHdmi3 = Key(KEYCODE_TV_INPUT_HDMI_3)

        /**
         * HDMI #4 key.
         *
         * Switches to HDMI input #4.
         */
        actual val TvInputHdmi4 = Key(KEYCODE_TV_INPUT_HDMI_4)

        /**
         * Composite #1 key.
         *
         * Switches to composite video input #1.
         */
        actual val TvInputComposite1 = Key(KEYCODE_TV_INPUT_COMPOSITE_1)

        /**
         * Composite #2 key.
         *
         * Switches to composite video input #2.
         */
        actual val TvInputComposite2 = Key(KEYCODE_TV_INPUT_COMPOSITE_2)

        /**
         * Component #1 key.
         *
         * Switches to component video input #1.
         */
        actual val TvInputComponent1 = Key(KEYCODE_TV_INPUT_COMPONENT_1)

        /**
         * Component #2 key.
         *
         * Switches to component video input #2.
         */
        actual val TvInputComponent2 = Key(KEYCODE_TV_INPUT_COMPONENT_2)

        /**
         * VGA #1 key.
         *
         * Switches to VGA (analog RGB) input #1.
         */
        actual val TvInputVga1 = Key(KEYCODE_TV_INPUT_VGA_1)

        /**
         * Audio description key.
         *
         * Toggles audio description off / on.
         */
        actual val TvAudioDescription = Key(KEYCODE_TV_AUDIO_DESCRIPTION)

        /**
         * Audio description mixing volume up key.
         *
         * Increase the audio description volume as compared with normal audio volume.
         */
        actual val TvAudioDescriptionMixingVolumeUp = Key(KEYCODE_TV_AUDIO_DESCRIPTION_MIX_UP)

        /**
         * Audio description mixing volume down key.
         *
         * Lessen audio description volume as compared with normal audio volume.
         */
        actual val TvAudioDescriptionMixingVolumeDown = Key(KEYCODE_TV_AUDIO_DESCRIPTION_MIX_DOWN)

        /**
         * Zoom mode key.
         *
         * Changes Zoom mode (Normal, Full, Zoom, Wide-zoom, etc.)
         */
        actual val TvZoomMode = Key(KEYCODE_TV_ZOOM_MODE)

        /**
         * Contents menu key.
         *
         * Goes to the title list. Corresponds to Contents Menu (0x0B) of CEC User Control Code
         */
        actual val TvContentsMenu = Key(KEYCODE_TV_CONTENTS_MENU)

        /**
         * Media context menu key.
         *
         * Goes to the context menu of media contents. Corresponds to Media Context-sensitive
         * Menu (0x11) of CEC User Control Code.
         */
        actual val TvMediaContextMenu = Key(KEYCODE_TV_MEDIA_CONTEXT_MENU)

        /**
         * Timer programming key.
         *
         * Goes to the timer recording menu. Corresponds to Timer Programming (0x54) of
         * CEC User Control Code.
         */
        actual val TvTimerProgramming = Key(KEYCODE_TV_TIMER_PROGRAMMING)

        /**
         * Primary stem key for Wearables.
         *
         * Main power/reset button.
         */
        actual val StemPrimary = Key(KEYCODE_STEM_PRIMARY)

        /** Generic stem key 1 for Wearables. */
        actual val Stem1 = Key(KEYCODE_STEM_1)

        /** Generic stem key 2 for Wearables. */
        actual val Stem2 = Key(KEYCODE_STEM_2)

        /** Generic stem key 3 for Wearables. */
        actual val Stem3 = Key(KEYCODE_STEM_3)

        /** Show all apps. */
        actual val AllApps = Key(KEYCODE_ALL_APPS)

        /** Refresh key. */
        actual val Refresh = Key(KEYCODE_REFRESH)

        /** Thumbs up key. Apps can use this to let user up-vote content. */
        actual val ThumbsUp = Key(KEYCODE_THUMBS_UP)

        /** Thumbs down key. Apps can use this to let user down-vote content. */
        actual val ThumbsDown = Key(KEYCODE_THUMBS_DOWN)

        /**
         * Used to switch current [account][android.accounts.Account] that is
         * consuming content. May be consumed by system to set account globally.
         */
        actual val ProfileSwitch = Key(KEYCODE_PROFILE_SWITCH)
    }

    actual override fun toString(): String = "Key code: $keyCode"
}

/**
 * The native keycode corresponding to this [Key].
 */
val Key.nativeKeyCode: Int
    get() = unpackInt1(keyCode)

fun Key(nativeKeyCode: Int): Key = Key(packInts(nativeKeyCode, 0))
