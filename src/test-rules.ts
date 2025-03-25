import { useState, useEffect } from 'react'
import axios from 'axios'

// 测试行长度超过80字符但不超过100字符的情况
const veryLongVariableName = 'this is a very long string that should trigger the ruler at 80 characters but not 100'

// 测试缩进和空格
function   testFunction(param1:   string,    param2:   number)    {
    const   localVar   =   'test'
    
    
    return {
        param1,
        param2,
        localVar
    }
}

// 测试括号对着色和自动导入
export class TestClass {
    private testMethod() {
        const [count, setCount] = useState(0)
        
        useEffect(() => {
            const fetchData = async () => {
                const response = await axios.get('https://api.example.com')
                return response.data
            }
        }, [])
        
        return count
    }
}

// 测试尾随空格      
const trailingSpaces = 'test'     

// 测试多余空行



// 测试行尾无分号
const testNoSemicolon = 'test'

// 测试引号类型
const singleQuotes = 'test'
const doubleQuotes = "test" 