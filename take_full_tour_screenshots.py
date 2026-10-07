import time
import os
from playwright.sync_api import sync_playwright

def run_tour():
    output_dir = 'C:/Users/kkani/.gemini/antigravity/brain/b7594925-f093-4d06-b37e-c3fd2a538ec0/screenshots'
    os.makedirs(output_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        
        console_logs = []
        page.on('console', lambda msg: console_logs.append(f'[{msg.type}] {msg.text}'))
        
        print("Navigating to http://localhost:5173 ...")
        page.goto('http://localhost:5173', wait_until='networkidle')
        time.sleep(2)
        
        # 1. Full page overview
        page.screenshot(path=f'{output_dir}/01_full_page.png', full_page=True)
        print("Captured 01_full_page.png")
        
        # 2. Hero Section
        hero = page.locator('#home')
        hero.screenshot(path=f'{output_dir}/02_hero.png')
        print("Captured 02_hero.png")
        
        # 3. Why It Matters & Pipeline
        pipeline = page.locator('#how-it-works')
        pipeline.scroll_into_view_if_needed()
        time.sleep(0.5)
        pipeline.screenshot(path=f'{output_dir}/03_why_it_matters.png')
        print("Captured 03_why_it_matters.png")
        
        # 4. Interactive Demo (Before clustering animation)
        demo = page.locator('#live-demo')
        demo.scroll_into_view_if_needed()
        time.sleep(1)
        demo.screenshot(path=f'{output_dir}/04_demo_initial.png')
        print("Captured 04_demo_initial.png")
        
        # Click "Run AI Clustering" button to trigger clustering animation (BRCA)
        run_btn = demo.locator('button:has-text("Run AI Clustering")')
        if run_btn.count() > 0:
            run_btn.click()
            time.sleep(2.5) # Wait for scatter animation
            demo.screenshot(path=f'{output_dir}/05_demo_clustered.png')
            print("Captured 05_demo_clustered.png")
            
        # Switch to Lung Cancer (TCGA-LUAD) toggle in Live Demo
        luad_toggle = demo.locator('button:has-text("Lung Cancer (TCGA-LUAD)")')
        if luad_toggle.count() > 0:
            luad_toggle.click()
            time.sleep(2)
            run_btn_luad = demo.locator('button:has-text("Run AI Clustering")')
            if run_btn_luad.count() > 0:
                run_btn_luad.click()
                time.sleep(2.5)
            demo.screenshot(path=f'{output_dir}/06_demo_luad_clustered.png')
            print("Captured 06_demo_luad_clustered.png")
            
        # 5. Explainer Flow Section
        explainer = page.locator('section:has-text("What AE-MAP Actually Outputs")')
        if explainer.count() > 0:
            explainer.scroll_into_view_if_needed()
            time.sleep(1)
            explainer.screenshot(path=f'{output_dir}/07_explainer_flow.png')
            print("Captured 07_explainer_flow.png")
            
        # 6. Analyze Your Own Data Section (BRCA Patient 02 test)
        upload_sec = page.locator('#custom-analysis')
        upload_sec.scroll_into_view_if_needed()
        time.sleep(1)
        
        # Click Patient 02 for BRCA
        p2_btn = upload_sec.locator('button:has-text("Patient 02")')
        if p2_btn.count() > 0:
            p2_btn.click()
            time.sleep(1)
        upload_sec.screenshot(path=f'{output_dir}/08_custom_analysis_brca.png')
        print("Captured 08_custom_analysis_brca.png")
        
        # Switch to Lung Cancer in Upload & test Patient 04
        upload_luad_btn = upload_sec.locator('button:has-text("Lung Cancer (TCGA-LUAD)")')
        if upload_luad_btn.count() > 0:
            upload_luad_btn.click()
            time.sleep(1)
            p4_btn = upload_sec.locator('button:has-text("Patient 04")')
            if p4_btn.count() > 0:
                p4_btn.click()
                time.sleep(1)
            upload_sec.screenshot(path=f'{output_dir}/09_custom_analysis_luad_staged.png')
            print("Captured 09_custom_analysis_luad_staged.png")
            
            # Click "Run Multi-Omic Analysis (LUAD)"
            analyze_btn = upload_sec.locator('button:has-text("Run Multi-Omic Analysis")')
            if analyze_btn.count() > 0:
                analyze_btn.click()
                time.sleep(3.5) # Wait for API response and animation
                upload_sec.screenshot(path=f'{output_dir}/10_custom_analysis_result.png')
                print("Captured 10_custom_analysis_result.png")
                
        # 7. Comparison & Scientific Rigor
        comparison = page.locator('section:has-text("Traditional Analysis vs. AE-MAP")')
        if comparison.count() > 0:
            comparison.scroll_into_view_if_needed()
            time.sleep(0.5)
            comparison.screenshot(path=f'{output_dir}/11_comparison.png')
            print("Captured 11_comparison.png")

        # 8. Case Study Spotlight & Metrics
        case_study = page.locator('section:has-text("Clinical Case Study Spotlight")')
        if case_study.count() > 0:
            case_study.scroll_into_view_if_needed()
            time.sleep(0.5)
            case_study.screenshot(path=f'{output_dir}/12_case_study.png')
            print("Captured 12_case_study.png")

        # 9. Use Cases & Clinical Translation
        use_cases = page.locator('#use-cases')
        if use_cases.count() > 0:
            use_cases.scroll_into_view_if_needed()
            time.sleep(0.5)
            use_cases.screenshot(path=f'{output_dir}/13_use_cases.png')
            print("Captured 13_use_cases.png")
            
        # 10. Jargon Buster & Glossary
        jargon = page.locator('section:has-text("Jargon Buster")')
        if jargon.count() > 0:
            jargon.scroll_into_view_if_needed()
            # Click second accordion to verify interaction
            second_acc = jargon.locator('button').nth(1)
            if second_acc.count() > 0:
                second_acc.click()
                time.sleep(0.5)
            jargon.screenshot(path=f'{output_dir}/14_jargon_buster.png')
            print("Captured 14_jargon_buster.png")

        # 11. About, Research Roadmap & Tech Stack
        about = page.locator('#about')
        if about.count() > 0:
            about.scroll_into_view_if_needed()
            time.sleep(0.5)
            about.screenshot(path=f'{output_dir}/15_about_roadmap.png')
            print("Captured 15_about_roadmap.png")

        tech_stack = page.locator('section:has-text("Production-Ready Architecture")')
        if tech_stack.count() > 0:
            tech_stack.scroll_into_view_if_needed()
            time.sleep(0.5)
            tech_stack.screenshot(path=f'{output_dir}/16_tech_stack.png')
            print("Captured 16_tech_stack.png")

        # 12. Footer
        footer = page.locator('footer')
        if footer.count() > 0:
            footer.scroll_into_view_if_needed()
            time.sleep(0.5)
            footer.screenshot(path=f'{output_dir}/17_footer.png')
            print("Captured 17_footer.png")

        # Test clicking navbar link to test smooth scrolling without collisions
        nav_cases = page.locator('nav a:has-text("Use Cases")')
        if nav_cases.count() > 0:
            nav_cases.click()
            time.sleep(1)
            page.screenshot(path=f'{output_dir}/18_nav_click_scroll.png')
            print("Captured 18_nav_click_scroll.png")

        print("\nConsole logs during tour:")
        for log in console_logs:
            print(" ", log)
            
        browser.close()
        print("\nTour complete!")

if __name__ == '__main__':
    run_tour()
