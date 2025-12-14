import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Investment plan configurations (should match the ones in planConfig.ts)
const PLAN_CONFIG = {
  '3-Day Plan': { durationDays: 3, dailyRate: 0.02, bonus: 0.05 },
  '7-Day Plan': { durationDays: 7, dailyRate: 0.025, bonus: 0.075 },
  '12-Day Plan': { durationDays: 12, dailyRate: 0.03, bonus: 0.09 },
  '15-Day Plan': { durationDays: 15, dailyRate: 0.035, bonus: 0.105 },
  '3-Month Plan': { durationDays: 90, dailyRate: 0.04, bonus: 0.12 },
  '6-Month Plan': { durationDays: 180, dailyRate: 0.045, bonus: 0.135 }
};

async function creditDailyROI() {
  try {
    console.log('Starting daily ROI crediting process...');

    // Get all active investments
    const { data: activeInvestments, error: invError } = await supabase
      .from('investments')
      .select('*')
      .eq('status', 'Active')
      .or('authStatus.is.null,authStatus.eq.approved');

    if (invError) {
      console.error('Error fetching active investments:', invError);
      return;
    }

    if (!activeInvestments || activeInvestments.length === 0) {
      console.log('No active investments found to credit ROI');
      return;
    }

    console.log(`Found ${activeInvestments.length} active investments to process`);

    for (const investment of activeInvestments) {
      try {
        const planConfig = PLAN_CONFIG[investment.plan];
        if (!planConfig) {
          console.warn(`Unknown plan: ${investment.plan} for investment ${investment.id}`);
          continue;
        }

        // Calculate daily ROI amount
        const dailyRoiAmount = investment.capital * planConfig.dailyRate;

        // Check if investment is still within duration
        const startDate = new Date(investment.date);
        const now = new Date();
        const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

        // Check if we already credited ROI today (compare dates)
        const lastCreditDate = investment.updated_at ? new Date(investment.updated_at) : startDate;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastCreditDay = new Date(lastCreditDate);
        lastCreditDay.setHours(0, 0, 0, 0);

        if (lastCreditDay >= today) {
          console.log(`ROI already credited today for investment ${investment.id}`);
          continue;
        }

        if (daysElapsed >= planConfig.durationDays) {
          // Investment completed - credit all remaining ROI plus final bonus
          const totalExpectedRoi = investment.capital * planConfig.dailyRate * planConfig.durationDays;
          const remainingRoi = totalExpectedRoi - (investment.creditedRoi || 0);
          const finalBonus = investment.capital * planConfig.bonus;

          // Update investment as completed
          await supabase
            .from('investments')
            .update({
              status: 'completed',
              creditedRoi: totalExpectedRoi,
              creditedBonus: finalBonus,
              updated_at: new Date().toISOString()
            })
            .eq('id', investment.id);

          // Credit remaining ROI and bonus to user's balance
          const { data: userData } = await supabase
            .from('users')
            .select('balance, bonus')
            .eq('idnum', investment.idnum)
            .single();

          if (userData) {
            const newBalance = (userData.balance || 0) + remainingRoi;
            const newBonus = (userData.bonus || 0) + finalBonus;

            await supabase
              .from('users')
              .update({
                balance: newBalance,
                bonus: newBonus,
                updated_at: new Date().toISOString()
              })
              .eq('idnum', investment.idnum);
          }

          console.log(`Completed investment ${investment.id}: Credited remaining ROI $${remainingRoi.toFixed(2)} and final bonus $${finalBonus.toFixed(2)}`);
          continue;
        }

        // Credit daily ROI for active investment
        await supabase
          .from('investments')
          .update({
            creditedRoi: (investment.creditedRoi || 0) + dailyRoiAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id);

        // Credit daily ROI to user's balance
        const { data: userData } = await supabase
          .from('users')
          .select('balance')
          .eq('idnum', investment.idnum)
          .single();

        if (userData) {
          const newBalance = (userData.balance || 0) + dailyRoiAmount;
          await supabase
            .from('users')
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('idnum', investment.idnum);
        }

        console.log(`Credited $${dailyRoiAmount.toFixed(2)} daily ROI for investment ${investment.id} (${investment.plan})`);

      } catch (invProcessError) {
        console.error(`Error processing investment ${investment.id}:`, invProcessError);
      }
    }

    console.log('Daily ROI crediting process completed successfully');

  } catch (err) {
    console.error('Script error:', err);
  }
}

// Run the daily ROI crediting
creditDailyROI();