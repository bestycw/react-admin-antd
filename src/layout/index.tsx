import { Layout } from "antd"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Outlet } from "react-router-dom"
const {Content} = Layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HomePage = (props: any) => {
    // const{children} = props
    console.log(props)
    return (
        <Layout style={{height:'100vh'}}>
            <Header></Header>
            <Content style={{marginTop:'82px',padding:'18px',height:'100%',background:'white'}}>
                <Outlet></Outlet>
            </Content>
            <Footer></Footer>
        </Layout>
    )
}
export default HomePage