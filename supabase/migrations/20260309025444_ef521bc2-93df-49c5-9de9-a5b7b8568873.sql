
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for insurance_quotes
DROP POLICY IF EXISTS "Admins can view all insurance quotes" ON public.insurance_quotes;
DROP POLICY IF EXISTS "Admins can update insurance quotes" ON public.insurance_quotes;
DROP POLICY IF EXISTS "Admins can delete insurance quotes" ON public.insurance_quotes;
DROP POLICY IF EXISTS "Anyone can request quotes" ON public.insurance_quotes;

CREATE POLICY "Anyone can request quotes" ON public.insurance_quotes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view all insurance quotes" ON public.insurance_quotes FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update insurance quotes" ON public.insurance_quotes FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete insurance quotes" ON public.insurance_quotes FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE for contact_callbacks
DROP POLICY IF EXISTS "Admins can view all callbacks" ON public.contact_callbacks;
DROP POLICY IF EXISTS "Admins can update callbacks" ON public.contact_callbacks;
DROP POLICY IF EXISTS "Admins can delete callbacks" ON public.contact_callbacks;
DROP POLICY IF EXISTS "Anyone can request callbacks" ON public.contact_callbacks;

CREATE POLICY "Anyone can request callbacks" ON public.contact_callbacks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view all callbacks" ON public.contact_callbacks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update callbacks" ON public.contact_callbacks FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete callbacks" ON public.contact_callbacks FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix email_tracking
DROP POLICY IF EXISTS "Admins can view all email tracking" ON public.email_tracking;
DROP POLICY IF EXISTS "Admins can update email tracking" ON public.email_tracking;

CREATE POLICY "Admins can view all email tracking" ON public.email_tracking FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update email tracking" ON public.email_tracking FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix sales_agents
DROP POLICY IF EXISTS "Admins can manage sales agents" ON public.sales_agents;
DROP POLICY IF EXISTS "Agents can view their own profile" ON public.sales_agents;

CREATE POLICY "Admins can manage sales agents" ON public.sales_agents FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view their own profile" ON public.sales_agents FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix blog_comments
DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.blog_comments;

CREATE POLICY "Anyone can submit comments" ON public.blog_comments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view all comments" ON public.blog_comments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update comments" ON public.blog_comments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete comments" ON public.blog_comments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix chatbot_transfers
DROP POLICY IF EXISTS "Anyone can create transfer requests" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Admins can view all transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Agents can view assigned transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Admins can update transfers" ON public.chatbot_transfers;
DROP POLICY IF EXISTS "Agents can update assigned transfers" ON public.chatbot_transfers;

CREATE POLICY "Anyone can create transfer requests" ON public.chatbot_transfers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view all transfers" ON public.chatbot_transfers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view assigned transfers" ON public.chatbot_transfers FOR SELECT TO authenticated USING (assigned_to = auth.uid());
CREATE POLICY "Admins can update transfers" ON public.chatbot_transfers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can update assigned transfers" ON public.chatbot_transfers FOR UPDATE TO authenticated USING (assigned_to = auth.uid());

-- Fix lead_redistribution_log
DROP POLICY IF EXISTS "Admins can view redistribution log" ON public.lead_redistribution_log;
DROP POLICY IF EXISTS "Agents can view their own redistributions" ON public.lead_redistribution_log;

CREATE POLICY "Admins can view redistribution log" ON public.lead_redistribution_log FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view their own redistributions" ON public.lead_redistribution_log FOR SELECT TO authenticated USING ((from_agent = auth.uid()) OR (to_agent = auth.uid()));

-- Fix agent_performance
DROP POLICY IF EXISTS "Admins can view all performance" ON public.agent_performance;
DROP POLICY IF EXISTS "Agents can view their own performance" ON public.agent_performance;

CREATE POLICY "Admins can view all performance" ON public.agent_performance FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view their own performance" ON public.agent_performance FOR SELECT TO authenticated USING (agent_id IN (SELECT id FROM sales_agents WHERE user_id = auth.uid()));

-- Fix achievement_badges
DROP POLICY IF EXISTS "Everyone can view badges" ON public.achievement_badges;
DROP POLICY IF EXISTS "Admins can manage badges" ON public.achievement_badges;

CREATE POLICY "Everyone can view badges" ON public.achievement_badges FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage badges" ON public.achievement_badges FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix agent_badges
DROP POLICY IF EXISTS "Admins can view all agent badges" ON public.agent_badges;
DROP POLICY IF EXISTS "Agents can view their own badges" ON public.agent_badges;
DROP POLICY IF EXISTS "Admins can manage agent badges" ON public.agent_badges;

CREATE POLICY "Admins can view all agent badges" ON public.agent_badges FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view their own badges" ON public.agent_badges FOR SELECT TO authenticated USING (agent_id IN (SELECT id FROM sales_agents WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage agent badges" ON public.agent_badges FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix monthly_goals
DROP POLICY IF EXISTS "Admins can manage goals" ON public.monthly_goals;
DROP POLICY IF EXISTS "Agents can view their own goals" ON public.monthly_goals;

CREATE POLICY "Admins can manage goals" ON public.monthly_goals FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Agents can view their own goals" ON public.monthly_goals FOR SELECT TO authenticated USING (agent_id IN (SELECT id FROM sales_agents WHERE user_id = auth.uid()));

-- Fix google_ads tables
DROP POLICY IF EXISTS "Admins can view all campaigns" ON public.google_ads_campaigns;
DROP POLICY IF EXISTS "Admins can insert campaigns" ON public.google_ads_campaigns;
DROP POLICY IF EXISTS "Admins can update campaigns" ON public.google_ads_campaigns;

CREATE POLICY "Admins can view all campaigns" ON public.google_ads_campaigns FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert campaigns" ON public.google_ads_campaigns FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update campaigns" ON public.google_ads_campaigns FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view all conversions" ON public.google_ads_conversions;
DROP POLICY IF EXISTS "Admins can insert conversions" ON public.google_ads_conversions;

CREATE POLICY "Admins can view all conversions" ON public.google_ads_conversions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert conversions" ON public.google_ads_conversions FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "No public access to subscriber data" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "No public access to subscriber data" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix quiz_leads
DROP POLICY IF EXISTS "Anyone can submit quiz leads" ON public.quiz_leads;
DROP POLICY IF EXISTS "Only admins can view quiz leads" ON public.quiz_leads;

CREATE POLICY "Anyone can submit quiz leads" ON public.quiz_leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Only admins can view quiz leads" ON public.quiz_leads FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
