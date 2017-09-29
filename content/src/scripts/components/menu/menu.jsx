import React from 'react';

const Menu = (props) =>{

  return (
    <div id="lists_option" className="lists_option full_s hide">
        <div className="l_opt_icons">
            <ul>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon otolist" aria-hidden="true" data-icon="&#xe902;"></div></a>
                    </div>
                </li>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon editpro2" aria-hidden="true" data-icon="&#xe914;"></div></a>
                    </div>
                </li>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon mlist2" aria-hidden="true" data-icon="&#xe90b;"></div></a>
                    </div>
                </li>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon add_list" aria-hidden="true" data-icon="&#xe91c;"></div></a>
                    </div>
                </li>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon supress_w" aria-hidden="true" data-icon="&#xe900;"></div></a>
                    </div>
                </li>
                <li>
                    <div className="l_opt_icon_wrap ripple">
                        <a href="#"><div className="l_opt_icon task" aria-hidden="true" data-icon="&#xe908;"></div></a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  );
}

export default Menu
