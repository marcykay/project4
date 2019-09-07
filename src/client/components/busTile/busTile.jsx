import React from 'react';

import PropTypes from 'prop-types';

import styles from './style.scss';

class BusTile extends React.Component {




    render() {
        let busArticle = "";
        if (this.props.busPref.length>0) {
            busArticle = this.props.busPref.map((item)=>{
                return <p>{item.busstopcode}, {item.serviceno}</p>
            })
        }

        return (
            <div className={styles.busTile}>
                {busArticle}
            </div>
        );
    }
}


export default BusTile;
