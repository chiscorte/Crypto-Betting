import React, { useEffect, useState } from "react";
import "./index.scss";
import { Grid } from "@mui/material";
import Header from "../Header";
import Footer from "../Footer";
import Deposit from "../Deposit";
import Withdraw from '../Withdraw'
import badge from "../../assets/icons/bookmark.png";

const Setting = () => {
  const settingItemData = {
    settingItems: [
      {
        title: "Account settings",
        items: ["General", "Verification"],
      },
      {
        title: "Bonuses",
        items: ["Offers", "Active bonuses", "Bonuses history"],
      },
      {
        title: "Tournaments",
        items: ["Available", "Active", "History"],
      },
      {
        title: "Cash",
        items: ["Deposit", "Withdrawal", "Transaction history"],
      },
      {
        title: "Gamblings",
        items: ["Bets history"],
      },
      {
        title: "Market",
        items: ["All", "Free Spins", "Instant Bonus"],
      },
      {
        title: "Loyalty",
        items: [],
      },
    ],

    allLeaves: function () {
      let result = [];

      this.settingItems.forEach((item) => {
        result = [...result, ...item.items];
      });

      return result;
    },
  };
  const settingItems = settingItemData.settingItems;
  const settingLeavesLen = settingItemData.allLeaves().length;
  const [leafSelectFlags, setLeafSelectFlags] = useState(new Array(settingLeavesLen).fill(false));
  const [currentSetting, setCurrentSetting] = useState('')
  let countLeaves = 0;

  const hClick = (e, indexOfLeaf, settingItem) => {
    let items = new Array(settingLeavesLen).fill(0);

    items[indexOfLeaf] = true;
    setLeafSelectFlags(items);

    setCurrentSetting(settingItem)
  };

  return (
    <Grid container direction="column" justifyContent="flex-start" rowSpacing={3} className="setting-page">
      <Grid item>
        <Header />
      </Grid>
      <Grid item xs={9} container justifyContent="flex-end" className="main-body-container">
        <Grid item xs={11} container justifyContent="flex-start" className="main-body">
          <Grid item xs={3} container direction="column" className="side-bar">
            {settingItems.map((settingItem, index) => (
              <>
                <Grid item className="sub-items-container" key={settingItem.title}>
                  <Grid item className="title">
                    {settingItem.title}
                  </Grid>

                  {settingItem.items.map((item, subIndex) => {
                    let count = countLeaves;

                    return (
                      <Grid item className="item" key={count} onClick={(e) => hClick(e, count, item)}>
                        {leafSelectFlags[countLeaves++] == true && <img src={badge} alt="actived" className="badge" />}
                        {item}
                      </Grid>
                    );
                  })}
                </Grid>
                {index < settingItems.length - 1 && <hr />}
              </>
            ))}
          </Grid>
          <Grid item xs={9} container justifyContent="center" className="view-pan">
            <Grid item xs={10}>
              {currentSetting === 'Deposit' && <Deposit />}
              {currentSetting === 'Withdrawal' && <Withdraw />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default Setting;
