
import {  Tabs } from "antd"
// import React, { useState } from 'react';
import { SearchOutlined, SettingOutlined, } from '@ant-design/icons';
import Menu from "./Menu";

const Header = () => {

    return (
        <header className="h-18 bg-white fixed w-full">
            <div className="flex h-12 items-center justify-around w-full">
                <div datatype="logo" className="min-w-[200px]">Logo</div>
                <div className="menu">
                    <Menu mode="horizontal"></Menu>
                </div>
                <div className="flex gap-1 ml-auto">
                    <div className="header-search cursor-pointer"><SearchOutlined /></div>
                    <div className="header-language"></div>
                    <div className="header-notification"> </div>
                    <div className="header-user">
                        <div className="header-avatar"></div>
                        <div className="">

                        </div>
                    </div>
                    <div className="header-setting cursor-pointer">
                        <SettingOutlined />
                    </div>
                </div>
            </div>
            <div className="header-tabs">
                <Tabs size='small' type="editable-card" hideAdd items={[{
                    label: 'Tab 1',
                    key: '1',
                },
                {
                    label: 'Tab 2',
                    key: '2',
                }]}></Tabs>
            </div>
        </header>
    )
}
export default Header