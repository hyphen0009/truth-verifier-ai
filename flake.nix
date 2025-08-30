{
  description = "Truth Verifier AI - Flask API for social media content verification";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      # A helper that helps us define the attributes below for
      # all systems we care about.
      eachSystem =
        f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      packages = eachSystem (
        { pkgs, ... }:
        let
          # Python package with all dependencies
          pythonEnv = pkgs.python3.withPackages (ps: with ps; [
            flask
            requests
            pillow
            numpy
            openai  # If you want to use OpenAI API as fallback
            pytube  # For YouTube video downloading
            ffmpeg-python
          ]);

          # Our Flask application
          truth-verifier-flask = pkgs.writeScriptBin "truth-verifier-flask" ''
            #!${pythonEnv}/bin/python
            import os
            import sys
            import subprocess
            import time
            from flask import Flask, request, jsonify

            app = Flask(__name__)

            def query_ollama(model: str, prompt: str) -> str:
                """Query Ollama model"""
                try:
                    import requests
                    response = requests.post(
                        'http://localhost:11434/api/generate',
                        json={'model': model, 'prompt': prompt, 'stream': False}
                    )
                    response.raise_for_status()
                    return response.json().get('response', 'No response from model')
                except Exception as e:
                    return f"Error querying {model}: {str(e)}"

            @app.route('/api/verify', methods=['POST'])
            def verify_content():
                """Verify social media content"""
                try:
                    data = request.get_json()
                    url = data.get('url', '')
                    
                    # Simulate processing (in real app, download and process video)
                    transcription = "Simulated transcription from video audio"
                    visual_analysis = "Simulated analysis of video frames"
                    
                    # Use Ollama for analysis
                    prompt = f"""
                    Analyze this social media content for credibility:
                    
                    URL: {url}
                    Transcription: {transcription}
                    Visual Analysis: {visual_analysis}
                    
                    Provide credibility assessment with:
                    1. Credibility rating (Highly Credible to Highly Unreliable)
                    2. Confidence score (0-100%)
                    3. Detailed conclusion
                    """
                    
                    analysis = query_ollama('llama3', prompt)
                    
                    return jsonify({
                        'success': True,
                        'url': url,
                        'credibility': 'Mixed Reliability',
                        'score': 65,
                        'transcription': transcription,
                        'visual_analysis': visual_analysis,
                        'conclusion': analysis,
                        'models_used': ['llama3']
                    })
                    
                except Exception as e:
                    return jsonify({
                        'success': False,
                        'error': str(e)
                    }), 500

            @app.route('/health', methods=['GET'])
            def health_check():
                """Health check endpoint"""
                return jsonify({'status': 'healthy', 'service': 'Truth Verifier AI'})

            if __name__ == '__main__':
                # Start Ollama if not running
                try:
                    subprocess.run(['ollama', 'serve'], check=False, start_new_session=True)
                    time.sleep(2)
                    subprocess.run(['ollama', 'pull', 'llama3'], check=False)
                except Exception as e:
                    print(f"Ollama setup warning: {e}")
                
                app.run(host='0.0.0.0', port=5000, debug=False)

            ''';
        in
        {
          default = pkgs.writeShellScriptBin "run-truth-verifier-flask" ''
            # Start Flask application
            echo "Starting Truth Verifier Flask API..."
            ${truth-verifier-flask}/bin/truth-verifier-flask
          '';

          flask-app = truth-verifier-flask;
          ollama = pkgs.ollama;
          python = pythonEnv;
        }
      );

      # Development environment
      devShells = eachSystem (
        { pkgs, ... }:
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              python3
              python3Packages.flask
              python3Packages.requests
              python3Packages.pillow
              ollama
              ffmpeg
            ];

            shellHook = ''
              echo "Truth Verifier AI Flask Development Environment"
              echo "Python: $(python --version)"
              echo "Flask API will be available at http://localhost:5000"
              echo ""
              echo "To start development:"
              echo "  python app.py"
              echo ""
              echo "To test the API:"
              echo '  curl -X POST http://localhost:5000/api/verify -H "Content-Type: application/json" -d \'{"url":"https://example.com/reel"}\''
            '';
          };
        }
      );

      # NixOS module
      nixosModules.default = { config, lib, pkgs, ... }:
        with lib;
        let
          cfg = config.services.truth-verifier-flask;
        in
        {
          options.services.truth-verifier-flask = {
            enable = mkEnableOption "Truth Verifier Flask API service";
            
            port = mkOption {
              type = types.port;
              default = 5000;
              description = "Port for Flask API";
            };
            
            host = mkOption {
              type = types.str;
              default = "0.0.0.0";
              description = "Host for Flask API";
            };
          };

          config = mkIf cfg.enable {
            systemd.services.truth-verifier-flask = {
              description = "Truth Verifier AI Flask API";
              after = [ "network.target" "ollama.service" ];
              wants = [ "ollama.service" ];
              
              serviceConfig = {
                ExecStart = "${self.packages.${pkgs.system}.flask-app}/bin/truth-verifier-flask";
                Restart = "always";
                User = "truth-verifier";
                Group = "truth-verifier";
                Environment = "FLASK_HOST=${cfg.host} FLASK_PORT=${toString cfg.port}";
              };
            };

            systemd.services.ollama = {
              enable = true;
              description = "Ollama AI Service";
              after = [ "network.target" ];
              serviceConfig = {
                ExecStart = "${pkgs.ollama}/bin/ollama serve";
                User = "ollama";
                Group = "ollama";
                Restart = "always";
              };
            };

            users.users.truth-verifier = {
              isSystemUser = true;
              group = "truth-verifier";
            };

            users.groups.truth-verifier = {};

            users.users.ollama = {
              isSystemUser = true;
              group = "ollama";
            };

            users.groups.ollama = {};

            environment.systemPackages = [ self.packages.${pkgs.system}.default ];
          };
        };
    };
}